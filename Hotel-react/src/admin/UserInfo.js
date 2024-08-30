import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserInfo = ({ show, onHide, userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show && userId) {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/user/${userId}`);
                    if (!response.ok) {
                        throw new Error('네트워크 응답이 올바르지 않습니다.');
                    }
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        } else {
            // Reset state if userId is not available
            setUser(null);
            setLoading(false);
            setError(null);
        }
    }, [show, userId]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>사용자 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: 'red', fontSize: '18px', marginTop: '20px' }}>
                        오류: {error}
                    </div>
                ) : (
                    user ? (
                        <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>이름:</strong> {user.username}</p>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>역할:</strong> {user.role}</p>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
                            사용자 정보를 찾을 수 없습니다.
                        </div>
                    )
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserInfo;

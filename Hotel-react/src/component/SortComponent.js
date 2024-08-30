import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

const SortComponent = ({ sortOption, setSortOption }) => {
    const sortSelect = (eventKey) => {
        setSortOption(eventKey);
    };

    let styleSort = {
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '10px',
        fontSize: '14px',
        textDecoration: 'none',
    };

    return (
        <div style={styleSort}>
            <DropdownButton
                id="sort-options"
                title="정렬 기준"
                onSelect={sortSelect}
                variant="custom"
                aria-label="Sort Options"
            >
                <Dropdown.Item eventKey="latest">날짜</Dropdown.Item>
                <Dropdown.Item eventKey="highScore">평점(높은)</Dropdown.Item>
                <Dropdown.Item eventKey="lowScore">평점(낮은)</Dropdown.Item>
            </DropdownButton>
        </div>
    );
};

export default SortComponent;
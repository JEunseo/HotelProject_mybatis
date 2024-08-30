import {Stack} from "react-bootstrap";

let Footer = () => {
    let styleList = {
        listStyleType: 'none',
        fontSize: '13px',
        margin: 0,
        marginBottom: 0,
        paddingTop:'50px',
        paddingBottom:'50px',
    }
    let styleBody = {
        backgroundColor: '#439798',
    }

    let styleWrap = {
        width:'80%'
    }

    let styleText = {
        fontSize: '13px',
        margin: 0,
    }

    return(
        <footer className="footer" style={styleBody}>
            <Stack direction="horizontal" gap={3} style={styleWrap} className={'container-fluid'}>
                <ul style={styleList}>
                    <li>
                        <p>제작자 : 김주영! 송지혜! 이헌재! 조은서! 황인성!</p>
                        <p>소요시간 : 2주(2024. 08. 01. ~ 2024. 08. 19.)</p>
                        <p>발표일자 : 2024.08.19.</p>
                        <p>발표 열심히 들어주셔서 감사합니다!!!</p>
                        <p>제작사 : 비트컴퓨터학원생일동</p>
                    </li>
                </ul>
                <p className={'ms-auto'} style={styleText}>copyright© 2024.08.19.️</p>
            </Stack>
        </footer>
    )

}

export default Footer
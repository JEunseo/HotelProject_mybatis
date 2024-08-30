import {Button, Stack} from "react-bootstrap";

let Nav = () => {
    const btnStyle = {
        padding: '8px 5px',
        backgroundColor: '#439798',
        color: 'white',
        border: '1px solid white',
        borderRadius: '5px',
        fontSize: '14px',
    }

    let wrapStyle = {
        width: '100%',
        
    }

    return (
        <nav style={wrapStyle}>
            <Stack direction="horizontal" className="d-sm-flex justify-content-center align-items-center">
                    <Button size={"sm"} onClick={()=>{
                        window.scrollTo({
                            top: 150,
                            behavior: 'smooth',
                        })
                    }} style={btnStyle}> 호텔상품 보기
                        </Button>
                    <Button size={"sm"} className={'m-lg-3'} onClick={()=>{
                        window.scrollTo({
                        top: 2700,
                        behavior: 'smooth',
                    })
                    }} style={btnStyle}> 인기상품 보기 </Button>
            </Stack>
        </nav>
    )
}

export default Nav;
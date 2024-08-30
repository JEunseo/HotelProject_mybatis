let Banner = () => {
    return (
        <img src={process.env.PUBLIC_URL + '/banner.png'} alt={'하와이 광고'} style={{
            display: 'inline-block',
            width: '100%',
            height: '200px',
        }}/>
    )
}

export default Banner;
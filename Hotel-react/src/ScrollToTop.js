import {useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function ScrollToTop (props) {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <>{props.children}</>
}

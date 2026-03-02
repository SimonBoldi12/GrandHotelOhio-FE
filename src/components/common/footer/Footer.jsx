import style from "./Footer.module.css";
function Footer() {

    return ( 
        <footer className={style.footer}>
            <span>Grand Hotel Ohio &copy; {new Date().getFullYear()}</span>
        </footer>
     );
}

export default Footer;
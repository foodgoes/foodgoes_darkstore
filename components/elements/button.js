import styles from '../../styles/Button.module.css'

export default function Button({children, ...props}) {
    const {onClick, plain, url, external=false, fullWidth=false, submit, primary, secondary, size="medium"} = props;

    let className = styles.button;

    if (plain) {
        className += ' ' + styles.buttonPlain;
    }
    if (fullWidth) {
        className += ' ' + styles.buttonFullWidth;
    }
    if (primary) {
        className += ' ' + styles.buttonPrimary;
    }
    if (secondary) {
        className += ' ' + styles.buttonSecondary;
    }
    if (size) {
        className += ' ' + styles['buttonSize_'+size];
    }

    if (url) {
        return <a target={!external ? '_self' : '_blank'} href={url} rel="noopener noreferrer">{children}</a>;
    }

    return <button 
        type={submit ? 'submit' : 'button'}
        className={className} 
        onClick={onClick}
        >{children}</button>
}
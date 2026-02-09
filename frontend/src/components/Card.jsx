import './Card.css';

const Card = ({ children, className = '', gradient = false, onClick }) => {
    const classes = ['card', gradient && 'card-gradient', className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;

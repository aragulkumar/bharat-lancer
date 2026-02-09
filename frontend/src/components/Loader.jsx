import './Loader.css';

const Loader = ({ size = 'md', fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="loader-fullscreen">
                <div className={`loader loader-${size}`}></div>
                <p className="loader-text gradient-text">Loading...</p>
            </div>
        );
    }

    return <div className={`loader loader-${size}`}></div>;
};

export default Loader;

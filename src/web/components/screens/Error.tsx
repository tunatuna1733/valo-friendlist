import React from "react";

import ErrorModule from '../../../styles/Error.module.css';

const { myAPI } = window;

type Props = {
    error?: string;
    detail?: string;
}

const Error: React.FC<Props> = (props) => {
    const handleRelaunch = async () => {
        await myAPI.relaunch();
    }

    return (
        <div className={ErrorModule.container}>
            <div className={ErrorModule.mainText}>
                {`Authentication\nError`}
            </div>
            <div className={ErrorModule.errorText}>
                {props.error}
            </div>
            <div className={ErrorModule.detailText}>
                {props.detail ? props.detail : `No details`}
            </div>
            <button className={ErrorModule.retryButton} onClick={handleRelaunch}>Retry</button>
        </div>
    );
}

export default Error;
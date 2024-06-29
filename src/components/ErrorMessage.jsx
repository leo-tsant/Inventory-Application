/* eslint-disable react/prop-types */
const ErrorMessage = ({ message }) => {
    return (
        <div className="bg-purple-500 text-white p-4 rounded-md text-center">
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;

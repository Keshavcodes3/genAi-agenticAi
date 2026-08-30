

const sendSuccessResponse = ({ res, statusCode = 200, message, data }) => {
    return res.status(statusCode).json({
        message: message,
        success: true,
        error: null,
        data: data
    })
}


const sendErrorResponse=({res,statusCode=500,message,data,errorMessage})=>{
    return res.status(statusCode).json({
        success:false,
        message:message,
        errorMessage:process.env.mode=='production'?"":errorMessage,
        data:data
    })
}



const sendResponse={
    sendErrorResponse,
    sendSuccessResponse
}

export default sendResponse
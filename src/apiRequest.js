const apiRequest = async (URL = '', object = null, errMsg = null) => {

    try {
        const response = await fetch(URL, object)
        if (!response) throw Error('you been disconected from server please reload the page')

    } catch (err) {
        errMsg = err.message
    } finally {
        return errMsg
    }


}


export default apiRequest;
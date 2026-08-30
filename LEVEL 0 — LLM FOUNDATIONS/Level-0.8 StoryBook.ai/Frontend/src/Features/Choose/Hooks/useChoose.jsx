import { useDispatch, useSelector } from 'react-redux'
import {
    createNewContent,
    takeFollowUp,
    getAllContent,
    deleteContent
} from "../Service/choose.service";
import {
    setMood,
    setGenre,
    setFormat,
    setUserPrompt,
    setLoading,
    setError,
    setCurrentCreation,
    setCreations,
    clearCurrentCreation,
    setIsBookmarked
} from "../Redux/choose.slice";
import { updateCredits } from "../../Auth/Redux/auth.slice";

export const useChoose = () => {
    const dispatch = useDispatch()
    const chooseState = useSelector((state) => state.choose)

    const choose = (Data) => {
        dispatch(setMood(Data.mood))
        dispatch(setGenre(Data.genre))
        dispatch(setFormat(Data.format))
        dispatch(setUserPrompt(Data.userPrompt))
    }

    const writeFresh = async (Data) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await createNewContent(Data)
            // Backend returns { success: true, response: generatedText, data: creationObject }
            const creation = res.data || {
                generatedText: res.response,
                format: Data.format,
                mood: Data.mood,
                genre: Data.genre,
                userPrompt: Data.userPrompt,
                title: "Untitled Masterpiece"
            }
            dispatch(setCurrentCreation(creation))
            dispatch(setMood(creation.mood || Data.mood))
            dispatch(setGenre(creation.genre || Data.genre))
            dispatch(setFormat(creation.format || Data.format))
            dispatch(setUserPrompt(creation.userPrompt || Data.userPrompt))
            dispatch(setIsBookmarked(creation.isBookmarked || false))
            
            if (res.creditsRemaining !== undefined) {
                dispatch(updateCredits(res.creditsRemaining))
            }
            
            return creation
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message ||
                (err?.code === 'ECONNABORTED'
                    ? 'Generation timed out. The server may be waking up — wait a moment and try again.'
                    : err.message) ||
                'Failed to generate content.';
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    const refineStory = async (storyId, followUpMessage) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await takeFollowUp({ storyId, followUpMessage })
            // Backend returns { success: true, data: updatedStoryObject }
            const updatedCreation = res.data
            dispatch(setCurrentCreation(updatedCreation))
            
            if (res.creditsRemaining !== undefined) {
                dispatch(updateCredits(res.creditsRemaining))
            }
            
            return updatedCreation
        } catch (err) {
            const errorMsg =
                err?.response?.data?.message ||
                (err?.code === 'ECONNABORTED'
                    ? 'Refinement timed out. Try again in a moment.'
                    : err.message) ||
                'Failed to refine content.';
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    const fetchMyWorks = async () => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const res = await getAllContent()
            // Backend returns { success: true, data: { stories: [...], poems: [...] } }
            dispatch(setCreations(res.data || { stories: [], poems: [] }))
            return res.data
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err.message || "Failed to fetch creations."
            dispatch(setError(errorMsg))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const removeWork = async (type, id) => {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            await deleteContent({ type, id })
            // Refresh list
            await fetchMyWorks()
        } catch (err) {
            const errorMsg = err?.response?.data?.message || err.message || "Failed to delete creation."
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    const resetChoose = () => {
        dispatch(clearCurrentCreation())
    }

    return {
        ...chooseState,
        choose,
        writeFresh,
        refineStory,
        fetchMyWorks,
        removeWork,
        resetChoose
    }
}


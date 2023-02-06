// For testing purposes

import { useEffect } from "react"
import { useAppDispatch } from "../../App/hooks"
import { fetchSubject } from "../../slicers/subject-slice"

export default function Home() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchSubject("fdsf"))
    }, [])

    return (
        <>
            <h1>Home</h1>
        </>
    )
}
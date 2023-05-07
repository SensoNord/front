// For testing purposes

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../App/hooks"
import { fetchSubject } from "../../slicers/subject-slice"
import { fetchRoles } from "../../slicers/role-slice"
import { RoleType } from "@directus/sdk"

export default function Home() {
    const dispatch = useAppDispatch()
    const { roles } = useAppSelector(state => state.role)

    useEffect(() => {
        dispatch(fetchSubject("28730aa8-275a-4b16-9ff2-1494f5342243"))
        dispatch(fetchRoles())
    }, [dispatch])

    return (
        <>
            <h1>Home</h1>
            <h2>Role</h2>
            <ul>
                {roles.map((role: RoleType) => (
                    <li key={role.id}>{role.name}</li>
                ))}
            </ul>
        </>
    )
}
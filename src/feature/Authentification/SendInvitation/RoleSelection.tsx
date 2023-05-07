import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../App/hooks"
import { RoleType } from "@directus/sdk"
import { fetchRoles } from "../../../slicers/role-slice"
import SelectField from "../../../components/Field/SelectField"

type RoleSelectionProps = {
    selectedRole: RoleType | undefined
    setSelectedRole: React.Dispatch<React.SetStateAction<RoleType | undefined>>
}

export default function RoleSelection(props: RoleSelectionProps) {
    const { selectedRole, setSelectedRole } = props
    const dispatch = useAppDispatch()
    const { roles } = useAppSelector(state => state.role)

    useEffect(() => {
        dispatch(fetchRoles())
    }, [dispatch])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = roles.find((role: RoleType) => role.name === event.target.value)
        setSelectedRole(role)
        console.log(role)
    }

    return (
        < SelectField
            options={roles.map((role: RoleType) => ({ value: role.name, label: role.name }))}
            value={selectedRole?.name || ''}
            handleChange={handleChange}
            required={true}
            label="Role: "
            className="select-field"
        />
    )
}
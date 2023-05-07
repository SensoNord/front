import { useState } from "react";
import RoleSelection from "./RoleSelection";
import { RoleType } from "@directus/sdk";

export default function InvitationMenu() {
    const [selectedRole, setSelectedRole] = useState<RoleType | undefined>()

    return (
        <>
            <RoleSelection 
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
            />
        </>
    )
}
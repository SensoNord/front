import {useEffect, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../App/hooks';
import { RoleType } from '@directus/sdk';
import { fetchRoles } from '../../slicers/user/role-slice';
import SelectField from '../Field/SelectField';

type RoleSelectionProps = {
    selectedRole: RoleType | undefined;
    setSelectedRole: React.Dispatch<React.SetStateAction<RoleType | undefined>>;
    setIsRoleValid: React.Dispatch<React.SetStateAction<boolean>>;
    classNameSelection?: string;
};

export default function RoleSelection(props: RoleSelectionProps) {
    const { selectedRole, setSelectedRole, setIsRoleValid, classNameSelection } = props;
    const dispatch = useAppDispatch();
    const { roles } = useAppSelector(state => state.role);
    const [cleanedRoles, setCleanedRoles] = useState<RoleType[]>([]);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);
    
    useEffect(() => {
        setCleanedRoles(roles.filter((role: RoleType) => !role.admin_access));
    }, [roles])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const role = cleanedRoles.find((role: RoleType) => role.name === event.target.value);
        setSelectedRole(role);
        role ? setIsRoleValid(true) : setIsRoleValid(false);
    };

    return (
        <SelectField
            options={cleanedRoles.map((role: RoleType) => ({
                value: role.name,
                label: role.name,
            }))}
            value={selectedRole?.name || ''}
            handleChange={handleChange}
            required={true}
            label=""
            className={classNameSelection}
        />
    );
}

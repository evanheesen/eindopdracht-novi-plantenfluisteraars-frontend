import React, {useEffect, useState} from 'react';
import axios from "axios";
import './EmployeeItemAdmin.css';
import Button from "../../../buttons/button/Button";
import {useForm} from "react-hook-form";
import ItemContent from "../../itemContent/ItemContent";
import FlexContainer from "../../../flexContainer/FlexContainer";
import IconEdit from "../../../../assets/Aanpassen.png";
import EditIcon from "../../editIcon/EditIcon";
import FormContainer from "../../../formContainer/FormContainer";
import InputElement from "../../../formComponents/inputElement/InputElement";
import DropdownElement from "../../../formComponents/dropdownElement/DropdownElement";

function EmployeeItemAdmin({ id }) {

    const [employee, setEmployee] = useState(null);
    const [editFields, toggleEditFields] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [itemDeleted, toggleItemDeleted] = useState(false);
    const {register, reset, handleSubmit, formState: {errors}} = useForm();
    const token = localStorage.getItem('token');
    const source = axios.CancelToken.source();

    useEffect(() => {
        console.log(id);

        async function fetchData() {
            try {
                const result = await axios.get(`http://localhost:8081/employees/${id}`,
                    {
                        headers: {
                            cancelToken: source.token,
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    });
                setEmployee(result.data);
                console.log("employeeItem result");
                console.log(result.data);

                return function cleanup() {
                    source.cancel();
                }

            } catch (e) {
                console.error(e);
            }
        }

        if (id) {
            fetchData();
        }

    }, [toggle]);

    async function onSubmit(data) {

        console.log(data);

        try {
            const result = await axios.patch(`http://localhost:8081/employees/edit/${id}`, {
                firstName: data.firstname,
                lastName: data.lastname,
                phone: data.phone,
                street: data.street,
                houseNumber: data.housenumber,
                postalCode: data.postalcode,
                city: data.city,
                status: data.status,
            }, {
                headers: {
                    cancelToken: source.token,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(result);
            toggleEditFields(false);
            setToggle(!toggle);

            return function cleanup() {
                source.cancel();
            }
        } catch (e) {
            console.error(e);
        }

    }

    async function deleteItem() {

        try {
            const result = await axios.delete(`http://localhost:8081/employees/delete/${id}`,
                {
                    headers: {
                        cancelToken: source.token,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

            console.log(result);
            toggleEditFields(false);
            toggleItemDeleted(true);

            return function cleanup() {
                source.cancel();
            }
        } catch (e) {
            console.error(e);
        }

    }

    useEffect(() => {

        if (itemDeleted) {
            setEmployee("deleted");
        }

    }, [itemDeleted]);

    function cancelEdit() {
        toggleEditFields(false);
        reset({
            firstname: employee.firstName,
            lastname: employee.lastName,
            phone: employee.phone,
            street: employee.street,
            housenumber: employee.houseNumber,
            postalcode: employee.postalCode,
            city: employee.city,
            status: "statusDefault"
        });
    }

    return (
        <div className="garden-item">
            {employee && employee != "deleted" &&
            <>
                {!editFields &&
                <>
                    <ItemContent
                        title={`${employee.firstName} ${employee.lastName}`}
                        address={`${employee.street} ${employee.houseNumber}, ${employee.city}`}
                        phone={employee.phone}
                    />

                    <FlexContainer
                        className="FlexContainer FlexContainer__status-row"
                    >
                        <Button
                        type="button"
                        className={`button__status button__status--${employee.status}`}
                        name={employee.status}
                        />
                        <EditIcon
                            name="Edit icon"
                            onClick={() => toggleEditFields(true)}
                            icon={IconEdit}
                        />
                    </FlexContainer>
                </>}

                {editFields &&
                <>
                <ItemContent
                title={`${employee.firstName} ${employee.lastName}`}
                />
                    <FormContainer
                        classNameContainer="form--container form--edit"
                        classNameBlock="FlexItem FlexItem--split"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="firstname"
                            placeholder={employee.firstName}
                            label="Voornaam"
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="lastname"
                            placeholder={employee.lastName}
                            label="Achternaam"
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="phone"
                            placeholder={employee.phone}
                            label="Telefoonnummer"
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="street"
                            placeholder={employee.street}
                            label="Straat"
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="housenumber"
                            label="Huisnummer"
                            placeholder={employee.houseNumber}
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="postalcode"
                            label="Postcode"
                            placeholder={employee.postalCode}
                            inputType="text"
                            className="inputField inputField--edit"
                            validationRules={{
                                pattern: {
                                    value: /^[0-9]{4}[a-zA-Z]{2}$/,
                                    message: "Ongeldige postcode",
                                }
                            }}
                        />
                        <InputElement
                            errors={errors}
                            register={register}
                            classNameItem="form-item--half"
                            name="city"
                            label="Woonplaats"
                            placeholder={employee.city}
                            inputType="text"
                            className="inputField inputField--edit"
                        />
                        <DropdownElement
                            errors={errors}
                            register={register}
                            classNameItem="dropdown-item--half"
                            label="Status"
                            classNameSelect="dropdownField"
                            nameSelect="status"
                            idSelect="dropdown-status-edit"
                            defaultValue="statusDefault"
                        >
                            <option value="statusDefault" disabled>{employee.status}</option>
                            <option value="Inactief" hidden={employee.status === "Inactief"}>Inactief</option>
                            <option value="Actief" hidden={employee.status === "Actief" || employee.status === "Inactief"}>Actief</option>
                        </DropdownElement>

                        <Button
                            type="button"
                            className="button--delete"
                            name="Item verwijderen"
                            onClick={deleteItem}
                        />

                        <FlexContainer
                            className="FlexContainer FlexContainer__status-row FlexContainer__edit"
                        >
                            <Button
                                type="submit"
                                className="button--edit"
                                name="Bevestig wijzigingen"
                            />
                            <Button
                                type="button"
                                className="button--edit button--edit-cancel"
                                name="Annuleer"
                                onClick={cancelEdit}
                            />
                        </FlexContainer>

                    </FormContainer>
                </>
                }


            </>}
            {employee && employee === "deleted" &&
            <ItemContent
                title="Item succesvol verwijderd"
            />
            }

        </div>
    );
}

export default EmployeeItemAdmin;
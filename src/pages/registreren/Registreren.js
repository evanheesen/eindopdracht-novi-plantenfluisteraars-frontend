import React, {useState} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import styles from "../registreren/Registreren.module.css";
import arrow from "../../assets/white-arrow.png";
import FormContainer from "../../components/formContainer/FormContainer";
import InputElement from "../../components/formComponents/inputElement/InputElement";
import FileUploadElement from "../../components/formComponents/fileUploadElement/FileUploadElement";
import Button from "../../components/buttons/button/Button";

function Registreren() {

    const {register, handleSubmit, formState: {errors}} = useForm();
    const history = useHistory();
    const [employeeLink, setEmployeeLink] = useState("");
    const [file, setFile] = useState();
    let employeeId = "";
    const source = axios.CancelToken.source();
    // let fileValue = "";


    // ##### error "cannot read properties of null(reading 'value')". Hoe dit op te lossen??
    // if(document.getElementById("dbFile-field").value === null) {
    //     fileValue = document.getElementById("dbFile-field").value
    // } else {
    //     fileValue = "";
    // }


    // let fileValue = document.getElementById("dbFile-field").value === null ? "" : document.getElementById("dbFile-field").value;

    // function getFileValue() {
    //     fileValue = document.getElementById("dbFile-field").value;
    //     console.log("file :" + fileValue)
    // }

    async function onSubmit(data) {
        console.log("form data: ")
        console.log(data)
        setFile(data.dbFile[0]);
        console.log(data.dbFile[0]);

        try {
            const result = await axios.post('http://localhost:8081/employees', {
                    email: data.email,
                    password: data.password,
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    street: data.street,
                    houseNumber: data.houseNumber,
                    postalCode: data.postalCode,
                    city: data.city,
                }, {
                    cancelToken: source.token,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

            employeeId = result.data.replace('http://localhost:8081/employees/', "");
            fileUpload();
            history.push("/login");

            return function cleanup() {
                source.cancel();
            }

        } catch (e) {
            console.error(e);
        }
    }

    async function fileUpload() {

        // Dit werkt niet!!
        let formData = new FormData();
        formData.append("dbFile", file)
        console.log(formData);

        try {
            const result = await axios.post(`http://localhost:8081/files/${employeeId}/upload-file`, {
                file: formData,
            }, {
                    cancelToken: source.token,
                },
                {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });

            console.log(result)

            return function cleanup() {
                source.cancel();
            }

        } catch (e) {
            console.error(e);
        }
    }


    return (
        <>
            <div className={styles["register-container"]}>

                <FormContainer
                    classNameItem={styles["section-item"]}
                    classNameBlock={styles["block-register"]}
                    classNameContainer={styles["form--container"]}
                    // title="Registreren als Plantenfluisteraar"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h2 className={styles.title}>Registreren als Plantenfluisteraar</h2>
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="firstName"
                        label="Voornaam"
                        inputType="text"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Voornaam is verplicht",
                        }}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="lastName"
                        label="Achternaam"
                        inputType="text"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Achternaam is verplicht",
                        }}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--full"
                        name="email"
                        label="Emailadres"
                        inputType="text"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Emailadres is verplicht",
                            minLength: {
                                value: 6,
                                message: "Het emailadres moet minstens 6 tekens bevatten",
                            }
                        }}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--full"
                        name="phone"
                        label="Telefoonnummer"
                        inputType="text"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Telefoonnummer is verplicht",
                            minLength: {
                                value: 10,
                                message: "Het telefoonnummer moet minstens 10 tekens bevatten",
                            }
                        }}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="street"
                        label="Straatnaam"
                        inputType="text"
                        className={styles["inputField"]}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="houseNumber"
                        label="Huisnummer"
                        inputType="text"
                        className={styles["inputField"]}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="postalCode"
                        label="Postcode"
                        inputType="text"
                        className={styles["inputField"]}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="city"
                        label="Plaats"
                        inputType="text"
                        className={styles["inputField"]}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="username"
                        label="Username"
                        inputType="text"
                        placeholder="minimaal 6 karakters"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Username is verplicht",
                            minLength: {
                                value: 6,
                                message: "De username moet minstens 6 tekens bevatten",
                            }
                        }}
                    />
                    <InputElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--half"
                        name="password"
                        label="Wachtwoord"
                        inputType="password"
                        placeholder="minimaal 6 karakters"
                        className={styles["inputField"]}
                        validationRules={{
                            required: "Wachtwoord is verplicht",
                            minLength: {
                                value: 6,
                                message: "Het wachtwoord moet minstens 6 tekens bevatten",
                            }
                        }}
                    />
                    <FileUploadElement
                        errors={errors}
                        register={register}
                        classNameItem="form-item--full"
                        name="dbFile"
                        className="fileUpload"
                        label="Upload een leuke foto van jezelf"
                    />

                    <button
                        type="submit"
                        className="button button--dark"
                    >
                        Registreren
                    </button>

                </FormContainer>

                {/*<h2>file: {fileValue}</h2>*/}

                <div className={styles["section-item"]}>
                    <img src={arrow} className={styles["arrow"]}/>
                    <p className={styles["register"]}>Heb je al een account? Log dan <Link to="/login">hier</Link> in.
                    </p>
                </div>


            </div>

        </>
    );
}

export default Registreren;
import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoSection from "../../infoSection/InfoSection";
import Button from "../../../buttons/button/Button";

function GardenItemCustomer({id,}) {

    const [garden, setGarden] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log(id);

        async function fetchData() {
            try {
                const result = await axios.get(`http://localhost:8081/gardens/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    });
                setGarden(result.data);
                console.log("gardenItem result");
                console.log(result.data);
            } catch (e) {
                console.error(e);
            }
        }

        fetchData();
    }, [id]);

    return (
        <section className="garden-item">
            {garden &&
            <>
                <h4>{garden.street} {garden.houseNumber}, {garden.city}</h4>
                <p><strong>Datum aanvraag: </strong>{garden.submissionDate}</p>
                <p><strong>Adres: </strong>{garden.street} {garden.houseNumber}, {garden.city}</p>
                <p><strong>Pakket beplanting: </strong>{garden.packagePlants}</p>

                {garden.status != "Open" &&
                <>
                    <p><strong>Naam Plantenfluisteraar: </strong>{garden.employee.firstName} {garden.employee.lastName}
                    </p>
                    <p><strong>Telefoon Plantenfluisteraar: </strong>{garden.employee.phone}</p>
                </>
                }
                <Button
                    type="button"
                    className="button__status"
                    name={garden.status}
                />
            </>
            }

        </section>
    );
}

export default GardenItemCustomer;
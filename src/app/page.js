'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const features = {
    people: ["name", "gender", "height", "skin_color", "homeworld"],
    films: ["title", "director", "episode_id", "producer", "release_date"],
    planets: ["name", "climate", "gravity", "terrain", "population"],
    species: ["name", "classification", "designation", "languaje", "skin_color"],
    vehicles: ["name", "model", "manufacturer", "vehicle_class", "max_atmosphering_speed"],
    starships: ["name", "model", "manufacturer", "starship_class", "max_atmosphering_speed"]

}

export default function Home() {

    const [resources, setResource] = useState([])
    const [selectResource, setSelectResource] = useState("")
    const [selectId, setSelectId] = useState("")
    const [data, setData] = useState({})
    const [error, setError] = useState(false)

    const getResources = async () => {
        try {
            const response = await axios.get("https://swapi.dev/api/")
            const result = await response.data
            console.log(result)
            const resources = Object.keys(result)
            const resourceOption = resources.map((item) => {
                return (
                    { label: item, url: result[item] }
                )
            })
            setResource(resourceOption)
        } catch (error) {
            console.log(error)
        }


    }

    useEffect(() => {
        getResources()
    }, [])

    const handleSearchResource = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.get(`${selectResource}${selectId}`)
            const result = await response.data
            result.resource = selectResource.split("/").at(4)

            if (result.resource === "people") {
                const planetsResponse = await axios.get(result.homeworld)
                const planetsResult = await planetsResponse.data
                result.homeworld = planetsResult.name
            }

            console.log(result)
            setData(result)
            setError(false)
        } catch (error) {
            console.log(error)
            setData({})
            setError(true)
        }
    }

    return (
        <main className={styles.container} >
            <form onSubmit={handleSearchResource} className={styles.main} action="">
                <div className={styles.forSearch}>
                    <h1>Search For:</h1>
                    <select
                        name="resourceIpt"
                        id="resourcesInput"
                        value={selectResource}
                        onChange={(e) => setSelectResource(e.target.value)}
                    >
                        <option value="" disabled>Select Resource</option>
                        {
                            resources.map((item, idx) => {
                                return (
                                    <option value={item.url} key={idx}>{item.label.toUpperCase()}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className={styles.forInput}>
                    <h1>ID:</h1>
                    <input
                        type="number"
                        name="idIpt"
                        id="idInput"
                        value={selectId}
                        onChange={(e) => setSelectId(e.target.value)}
                    />
                    <button type="submit">Search:</button>
                </div>
            </form>
            <hr />
            <div className={styles.list} >
                {
                    Object.keys(data).length > 0 ?
                        features[data.resource].map((item, idx) => {
                            return (
                                <h1 key={idx}>{item.toUpperCase()}: {data[item]} </h1>
                            )
                        })
                        :
                        null
                }
            </div>

            {
                error &&
                <div className={styles.error}>
                    <h1>Estos no son los droides que estas buscando</h1>
                    <img src="https://www.elfinanciero.com.mx/resizer/3qweylAlYNBjn0CvUxWwVmVW_YM=/1440x810/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/elfinanciero/UA7NSCJLMFFTXPT2O5OJ2BF6CQ.jpg" alt="Obiwan" />
                </div>
            }
        </main>
    )
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const initialMovieData = {
  title: '',
  director: '',
  metascore: '',
  stars: ['']
}

export const UpdateMovie = (props) => {
  const { updateMovieList } = props
  const [ movieData, setMovieData ] = useState(initialMovieData)
  const { id } = useParams()
  const { push } = useHistory()

  useEffect(() => {
    axios.get(`http://localHost:5000/api/movies/${id}`)
    .then(response => {
      console.log('response.data', response);
      setMovieData(response.data)
    }).catch(error => console.log(error))
  }, [id])

  const defaultChangeHandler = event => {
    setMovieData({
      ...movieData,
      [event.target.name]: event.target.value
    })
  }
  const starsChangeHandler = (event, index) => {
    setMovieData({
      ...movieData,
        stars: movieData.stars.map((star, starIndex) => {
          return starIndex === index ?
            event.target.value:
            star;
        })
    })
  }
  const onSubmit = event => {
    event.preventDefault()
    axios.put(`http://localhost:5000/api/movies/${id}`, movieData)
    .then(response => {
      updateMovieList(movieData, id)
      push(`/`)
    })
    .catch(error => console.log(error))
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Title:
          <input
            type='string'
            name='title'
            value={movieData.title}
            onChange={defaultChangeHandler}
          />
        </label>
        <label>Director:
          <input
            type='string'
            name='director'
            value={movieData.director}
            onChange={defaultChangeHandler}
          />
        </label>
        <label>Metascore:
          <input 
            type='number'
            name='metascore'
            value={movieData.metascore}
            onChange={defaultChangeHandler}
          />
        </label>
        {movieData.stars.map((star, index) => {
          return (
            <label key={index}>Star {index +1}: 
              <input
                type='string'
                name='stars'
                value={movieData.stars[index]}
                onChange={event => starsChangeHandler(event, index)}
              />
              <button onClick={event => {
                event.preventDefault()
                const splicedStarsList = movieData.stars.splice(index, 1)
                setMovieData({
                  ...movieData,
                  ...splicedStarsList
                })
              }}>Remove Star</button>
            </label>
          )
        })}
        <button>Update Movie</button>
      </form>
        <button onClick={()=>{setMovieData({
          ...movieData,
            stars:[
              ...movieData.stars,
              ''
            ]
        })}}>Add Star</button>
    </div>
  )
}
import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import axios from 'axios';

import SavedList from "./Movies/SavedList";
import MovieList from "./Movies/MovieList";
import Movie from "./Movies/Movie";
import { UpdateMovie } from "./Movies/UpdateMovie"

const App = () => {
  const [savedList, setSavedList] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const { push } = useHistory()

  const getMovieList = () => {
    axios
      .get("http://localhost:5000/api/movies")
      .then(res => setMovieList(res.data))
      .catch(err => console.log(err.response));
  };
  

  const deleteMovie = (id) => {
    axios.delete(`http://localhost:5000/api/movies/${id}`)
    .then(res => {
      setMovieList(
        movieList.filter((item, index) => index !== parseInt(id))
      )
      push('/')
    })
    .catch(err => console.log(err))
  }
  const addToSavedList = movie => {
    setSavedList([...savedList, movie]);
  };
  const updateMovieList = (updatedMovieData, id) => {
    const newMovies = movieList.map((movie, index) => {
      return movie.id === parseInt(id)?
      updatedMovieData:
      movie;
    });

    setMovieList(newMovies)
  }

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <>
      <SavedList list={savedList} />

      <Route exact path="/">
        <MovieList movies={movieList} />
      </Route>

      <Route path="/movies/:id">
        <Movie addToSavedList={addToSavedList} deleteMovie={deleteMovie} movieList={movieList} />
      </Route>

      <Route path="/update-movie/:id">
        <UpdateMovie movieList={movieList} updateMovieList={updateMovieList}/>
      </Route>
    </>
  );
};

export default App;

import React, { useState, useEffect } from 'react'
import { getMovies } from '../apis/movie'
import Movie from '../components/Movie'
import Pagination from '../components/Pagination'
import MovieForm from '../components/MovieForm'
import Modal from '../components/Modal'
import { getMovie } from '../apis/movie'

const limit = 5

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [movieModal, setMovieModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)

  const toggleModal = () => setMovieModal(prevState => !prevState)
  const handleNext = () => setCurrentPage(currentPage + 1)

  const handlePrev = () => {
    if (currentPage < 1) return
    setCurrentPage(currentPage - 1)
  }

  const fetchMovies = async () => {
    const { data, error } = await getMovies(currentPage, limit)
    if (!data.movies.length) return setCurrentPage(currentPage - 1)
    setMovies(data.movies)
  }

  const handleOnMovieEdit = async id => {
    toggleModal()
    const { data, error } = await getMovie(id)
    console.log(data.movie)
    setSelectedMovie(data.movie)
  }

  useEffect(() => {
    fetchMovies()
  }, [currentPage])

  const renderMovies = () => movies.map(movie => <Movie key={movie._id} movie={movie} onEdit={handleOnMovieEdit} />)

  return (
    <div className='grid max-w-3xl'>
      <div className='divide-black dark:divide-white divide-y-2'>{renderMovies()}</div>
      <Pagination handlePrev={handlePrev} handleNext={handleNext} />

      {movieModal && (
        <Modal closeModal={setMovieModal}>
          <MovieForm closeModal={setMovieModal} visible={movieModal} selectedMovie={selectedMovie} />
        </Modal>
      )}
    </div>
  )
}

export default Movies

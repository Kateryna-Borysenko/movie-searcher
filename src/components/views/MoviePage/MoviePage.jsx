import { useState, useEffect, useRef } from 'react';
import { fetchQueryMovies } from 'services/api';
import * as storage from 'services/localStorage';
import s from './MoviePage.module.css';
import MovieList from 'components/MovieList/MovieList';

const STORAGE_KEY = 'movies';

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  //пришлось сохранить в localStorage иначе срабатывала на onCange
  const [savedQuery, setsavedQuery] = useState(storage.get(STORAGE_KEY) ?? '');

  useEffect(() => {
    storage.save(STORAGE_KEY, savedQuery);

    const getMovies = async () => {
      try {
        if (savedQuery === '') {
          return;
        }

        const movies = await fetchQueryMovies(savedQuery);

        setMovies([...movies]);
        console.log('Фетч по введённому запросу');
      } catch (error) {
        console.log(error);
      }
    };
    // ******** смущает очистка в этом месте  ********** //
    // storage.remove(STORAGE_KEY);

    getMovies();
  }, [savedQuery]);

  const inputRef = useRef(null); //!фокус
  useEffect(() => {
    inputRef.current.focus(); //!фокус
  });

  const handleSubmit = e => {
    e.preventDefault();
    setsavedQuery(query); //при сабмите записалось в состояние значение введенное user
  };
  return (
    <>
      <div className={s.wrap}>
        <form onSubmit={handleSubmit}>
          <input
            onChange={e => setQuery(e.target.value)}
            value={query} //запрос
            className={s.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Input movie name..."
            ref={inputRef} //!фокус
          />
          <button type="submit" className={s.button}>
            Search
          </button>
        </form>
      </div>
      <MovieList movies={movies} />
    </>
  );
};

export default MoviePage;

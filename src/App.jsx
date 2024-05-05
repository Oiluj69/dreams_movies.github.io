import { useEffect } from 'react';
import axios from 'axios'
import './App.css';
import { useState } from 'react';
import YouTube from 'react-youtube';

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "7570168c8f5391241c1f5fd6de390698";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

  // endpoint para las imagenes
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  // variables de estado
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  //const [selectedMovie, setSelectedMovie] = useState({})
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);

  // funcion para realizar la peticion get a la api
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    //console.log('data',results);
    //setSelectedMovie(results[0])

    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  // funcion para la peticion de un solo objeto y mostrar en reproductor de videos
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    //return data
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    // const data = await fetchMovie(movie.id)
    // console.log(data);
    // setSelectedMovie(movie)
    fetchMovie(movie.id);

    setMovie(movie);
    window.scrollTo(0, 0);
  };

  // funcion para buscar peliculas
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className=' '>
      <div className='banner col-md-12 d-flex py-4'>
        <h2 className="text-center">Dreams Trailer Movies</h2>

        {/* el buscador */}
        <div className='formulario text-center'>
          <form className="container" onSubmit={searchMovies}>
            <input className='search py-1 my-2'
              type="text"
              placeholder="search"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button className="btn_btn mx-2 py-1 bg-primary">Search</button>
          </form>
        </div>
      </div>

      {/* contenedor para previsualizar  */}

      {/* esto es por prueba */}
      <div className='preview'>
        <main className=''>
          {movie ? (
            <div
              className="viewtrailer mb-5"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <div className="center">
                    <YouTube
                      videoId={trailer.key}
                      className="reproductor"
                      //  containerClassName={"youtube-container amru"}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 1,
                          controls: 0,
                          cc_load_policy: 0,
                          fs: 0,
                          iv_load_policy: 0,
                          modestbranding: 0,
                          rel: 0,
                          showinfo: 0,
                        },
                      }}
                    />
                    <button onClick={() => setPlaying(false)} className="boton mx-5 bg-primary">
                      Close
                    </button>
                  </div>
                </>
              ) : (

                <div className="">
                  {trailer ? (
                    <button
                      className="boton bg-primary mx-3"
                      onClick={() => setPlaying(true)}
                      type="button"
                    >
                      Play Trailer
                    </button>
                  ) : (
                    <div className='sorry text-center mb-5'>
                      <h1>¡Sorry! No trailer available</h1>
                    </div>
                  )}
                  <div className='overview px-1 py-1 text-center'>
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white text-center">{movie.overview}</p>
                  </div>
                </div>

              )}
            </div>
          ) : null}
        </main>
      </div>

      {/* contenedor para mostrar los posters y las peliculas en la peticion a la api */}
      <div className="mx-3">
        <div className="row">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="col-md-3 mb-3"
              onClick={() => selectMovie(movie)}
            >
              <img
                src={`${URL_IMAGE + movie.poster_path}`}
                alt=""
                height={400}
                width="100%"
              />
              <div className='title bg-dark text-white py-1'>
                <h4 className="text-center">{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

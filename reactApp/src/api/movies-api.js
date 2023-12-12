export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=2762ed638849ecddf7f48af57ef13c16&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };
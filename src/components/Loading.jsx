function Loading({ message }) {
  return <h2 className="loading">{ message ? message : "Loading..."}</h2>
}

export default Loading;
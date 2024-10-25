const Load = ():JSX.Element => {
  return(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <span className="loading loading-dots loading-lg text-white"></span>
      </div>
    </>
  )
}

export default Load
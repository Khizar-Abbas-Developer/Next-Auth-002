import Image from "next/image";
const page = () => {
  return (
    <>
      <div className="card card-side bg-base-100 shadow-xl">
        <figure><Image src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" width={200} height={280} className="w-[200px] h-[280px] object-contain" alt="Movie" priority /></figure>
        <div className="card-body">
          <h2 className="card-title">ABOUT Page</h2>
          <p>This is basically an Authentication system</p>
          <p>Contrary to popular belief, Lorem Ipsum is not son 1.10.32.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Watch</button>
          </div>
        </div>
      </div>
    </>
  )
}
export default page
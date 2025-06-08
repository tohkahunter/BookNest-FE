import React, { useState } from "react";
import { Link } from "react-router-dom";
import mockBookData from "./models/bookData";
import mockBook from "../../assets/mockBook.jpg";
import relatedBook from "../../assets/relatedBook.jpg";
import choiceAwards from "../../assets/choiceAward.png";
export default function Home() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const fullDescription = mockBookData.relatedBooks[0].description;
  const shortDescription =
    fullDescription.length > 150
      ? fullDescription.slice(0, 150) + "..."
      : fullDescription;

  return (
    <>
      <div className="home-container flex justify-between mb-5">
        {/* Left Container */}
        <div className="left-container ml-[10.5%] max-w-[20%]">
          <div className="left-container_items border-b border-b-gray-300 pb-[12px]">
            <h3 className="text-sm mt-1">CURRENTLY READING</h3>
            <div className="flex gap-2 mt-2">
              <img className="max-w-[30%] rounded-xs" src={mockBook} alt="" />
              <div>
                <p className="font-bold">{mockBookData.title}</p>
                <p className="text-sm">by {mockBookData.author.name}</p>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <a href="" className="link link-success no-underline">
                View all book
              </a>
              <span> · </span>
              <a href="" className="link link-success no-underline">
                Add a book
              </a>
            </div>
          </div>

          <div className="left-container_items border-b border-b-gray-300 pb-[12px] pt-[10px]">
            <h3 className="text-sm mt-1">WANT TO READ</h3>
            <div className="flex gap-2 mt-2">
              <img
                className="max-w-[30%] max-h-[100px] rounded-xs"
                src={mockBook}
                alt=""
              />
            </div>
            <div className="mt-1">
              <a href="" className="link link-success text-sm no-underline">
                View all book
              </a>
            </div>
          </div>

          <div className="left-container_items pt-[10px]">
            <h3 className="text-sm mt-1 mb-[10px]">BOOKSHELVES</h3>
            <div className="flex gap-3 text-sm mb-1 text-success">
              <p>2</p>
              <p>Want to Read</p>
            </div>
            <div className="flex gap-3 text-sm mb-1 text-success">
              <p>2</p>
              <p>Currently reading</p>
            </div>
            <div className="flex gap-3 text-sm text-success">
              <p>2</p>
              <p>Reading</p>
            </div>
          </div>
        </div>

        {/* Middle Container */}
        <div className="middle-container">
          <h3>UPDATES</h3>
          <div>No more Updates</div>
        </div>

        {/* Right Container */}
        <div className="right-container mr-[10.5%] max-w-[19%]">
          <div className="right-container_items border-b border-b-gray-300 pb-[12px]">
            <h3 className="text-sm mt-4 mb-2">RECOMMENDATIONS</h3>
            <p className="text-sm">
              Because you are currently reading{" "}
              <span className="font-bold">{mockBookData.title}:</span>
            </p>
            <div className="flex gap-2 mt-2">
              <img
                className="max-w-[30%] rounded-xs"
                src={relatedBook}
                alt=""
              />
              <div>
                <p className="font-bold">
                  {mockBookData.relatedBooks[0].title}
                </p>
                <p className="text-sm">by {mockBookData.author.name}</p>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= Math.floor(mockBookData.relatedBooks[0].rating)
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-stone-500 text-base">
                    {mockBookData.relatedBooks[0].count}
                  </span>
                </div>
                <button className="btn btn-success mt-[8px] text-white">
                  Want to Read
                </button>
              </div>
            </div>

            {/* Inline Read More / Show Less */}
            <p className="mt-2 text-sm">
              {showFullDescription ? fullDescription : shortDescription}
              {fullDescription.length > 150 && (
                <button
                  onClick={toggleDescription}
                  className="text-warning cursor-pointer inline p-0 ml-1 bg-transparent border-none"
                >
                  {showFullDescription ? " Show Less" : " Continue reading"}
                </button>
              )}
            </p>

            <div className="mt-2 text-sm">
              <a href="" className="link link-success no-underline">
                View all book similar to {mockBookData.relatedBooks[0].title}
              </a>
            </div>
          </div>
          <div className="right-container_items">
            <h3 className="pt-[10px] pb-[10px]">GOODREADS CHOICE AWARDS</h3>

            <div className="bg-neutral/85 text-white ">
                <img src={choiceAwards} alt="" />
                <div className="pl-7 pr-7 pt-4 pb-9">
                  <p className="text-base font-bold">Announcing Readers'<br/><span>Favorite Books of 2024</span></p>
                  <button className="btn btn-warning text-neutral h-[30px] w-[100%] mt-3">See the winners</button>
                  <p className="mt-3 text-sm">6,261,936 Votes Cast</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

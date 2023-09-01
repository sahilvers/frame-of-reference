import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";

const TerminalSimulator = ({ step, setStep }) => {
  const introductionText = `Hello,
      
      Welcome to our manifestation portal, here you can materialize anything you want to create, simply by willing it into action.
      
      Product, Service, API, invention, global / local solution.
      
      Take a moment. Visualize your idea with all 5 senses and take it to the source.
      `;

  const [typedText, setTypedText] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);
  const currentTextIndex = useRef(0);

  useEffect(() => {
    // Initial delay of 3 seconds before typing starts
    const initialDelayId = setTimeout(() => {
      setDelayComplete(true); // Set delay as complete
    }, 1000); // 1 second delay

    return () => clearTimeout(initialDelayId); // Clear timeout on unmount
  }, []);

  useEffect(() => {
    if (!delayComplete) return; // Don't do anything if the initial delay isn't complete

    let timeoutLength = 30; // Speed up when deleting

    const timerId = setTimeout(() => {
      if (typedText === introductionText) {
        setButtonVisible(true); // Set the button as visible
      } else {
        setTypedText(
          (prevText) => prevText + introductionText[prevText.length]
        ); // Increase the length of the text
      }
    }, timeoutLength);

    return () => clearTimeout(timerId); // Clear timeout on unmount
  }, [delayComplete, typedText, introductionText]);

  const renderText = typedText.split("\n").map((item, key) => {
    return (
      <span key={key}>
        {item}
        {key === typedText.split("\n").length - 1 && (
          <span className="text-cyan-500 ml-1">_</span>
        )}
        <br />
      </span>
    );
  });

  // handle proceed clicked, set proceedClicked to true
  const handleProceedClicked = () => {
    setIsVisible(false);

    // after 1.5 seconds, set step to 1
    setTimeout(() => {
      setStep(1);
    }, 1500);
  };

  const [scrollPosition, setScrollPosition] = useState(1);
  const [images, setImages] = useState([]);
  const [windowHeight, setWindowHeight] = useState(0);

  const imgRef = useRef(); // Reference to the image element

  const totalImages = 1200;
  const sampledImages = Math.floor(totalImages / 4);
  const scrollAmountPerImage = 20; // adjust this to the desired scroll amount per image
  const stepSize = Math.floor(totalImages / sampledImages);

  // Load and preload your images
  useEffect(() => {
    let loadedImages = [];
    for (let i = 0; i <= totalImages; i += stepSize) {
      let paddedIndex = String(i).padStart(4, "0"); // pad the index with leading zeros
      let imagePath = `/animation_3/640x360/AB_${paddedIndex}.png`;
      loadedImages.push(imagePath);

      // Preload the image
      let img = new Image();
      img.src = imagePath;
    }
    setImages(loadedImages);
  }, []);

  // Event listener for scroll events
  useEffect(() => {
    const onScroll = () => {
      let newPosition = window.pageYOffset;
      let index = Math.ceil(newPosition / scrollAmountPerImage);
      index = Math.min(sampledImages - 1, Math.max(0, index)); // Ensure index is within the range

      // if the final index, set step to 1
      if (index === sampledImages - 1) {
        setStep(1);
      }

      setScrollPosition(index);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Effect to update the image src when scrollPosition changes
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = images[scrollPosition];
    }
  }, [scrollPosition, images]);

  // Calculate opacity based on scroll position
  const opacity = 1 - scrollPosition / (sampledImages - 1);

  return (
    <>
      {step === 0 && (
        <>
          <div
            style={{
              height: `${totalImages * sampledImages}px`,
            }}
          />{" "}
          {/* spacer div */}
          <div className="fixed w-screen h-screen z-20 text-white overflow-hidden">
            {/* <div className="fixed top-0 z-90 text-red-300">
              {images[scrollPosition]}
            </div> */}
            <img
              ref={imgRef}
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div
            style={{ opacity: opacity }}
            className={`fixed h-screen w-full p-12 flex justify-center `}
          >
            <div className="bg-black text-white w-[400px] pt-8 max-w-11/12 font-mono">
              <p>{renderText}</p>
            </div>

            <div className="absolute phone:bottom-24 bottom-12   flex justify-center">
              <div
                className={`mt-4 p-4 border-white border-2 font-mono transition-opacity duration-3000 ${
                  buttonVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Scroll to Proceed
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TerminalSimulator;

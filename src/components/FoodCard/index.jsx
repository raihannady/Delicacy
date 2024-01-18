import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import classes from "./style.module.scss";
import { callAPI } from "../../domain/api";
import { callAPI2 } from "../../domain/api2";

const FoodCard = ({ category }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      const response = await callAPI(`/filter.php?c=${category}`, "GET");
      const slicedResponse = response?.meals?.slice(0, 5);
      const modifiedResponse = slicedResponse?.map(async (item) => {
        const responseByName = await callAPI(
          `/lookup.php?i=${item.idMeal}`,
          "GET"
        );
        const {
          idMeal,
          strInstructions,
          strIngredient1,
          strMeasure1,
          strIngredient2,
          strMeasure2,
          strIngredient3,
          strMeasure3,
          strIngredient4,
          strMeasure4,
          strMealThumb,
          strMeal,
        } = responseByName.meals[0];
        return {
          idMeal,
          strInstructions,
          strIngredient1,
          strMeasure1,
          strIngredient2,
          strMeasure2,
          strIngredient3,
          strMeasure3,
          strIngredient4,
          strMeasure4,
          strMealThumb,
          strMeal,
        };
      });

      const finalResponse = await Promise.all(modifiedResponse);
      setData(finalResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const postFavorite = async (data) => {
    try {
      await callAPI2(
        "/favorite",
        "POST",
        {},
        {},
        {
          id: data.idMeal,
          title: data.strMeal,
          image: data.strMealThumb,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className={classes.container}>
        {data &&
          data.map((data, index) => (
            <div key={index} className={classes.fooddetail}>
              <div className={classes.desc}>
                <h1>{data.strMeal.slice(0, 20)}</h1>
                <p>{data.strInstructions.slice(0, 200) + "..."}</p>
                <h2>Ingredients</h2>
                <div className={classes.ingredient}>
                  <div className={classes.layout}>
                    <div className={classes.svg}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="27"
                        viewBox="0 0 26 27"
                        fill="none"
                      >
                        <path
                          d="M2.54962 25.5175C2.76191 25.5175 2.97592 25.4268 3.0748 25.2294C3.23535 24.909 3.02088 24.521 2.55331 24.2859C2.22605 24.1213 1.6865 24.0289 1.48503 24.4311C1.32449 24.7515 1.53895 25.1395 2.00653 25.3746C2.19368 25.4688 2.38214 25.5175 2.54962 25.5175Z"
                          fill="black"
                        />
                        <path
                          d="M6.98518 24.2859C6.46156 24.2859 6.09586 24.5364 6.09586 24.8951C6.09586 25.2538 6.46156 25.5043 6.98518 25.5043C7.5088 25.5043 7.8745 25.2538 7.8745 24.8951C7.87455 24.5364 7.50885 24.2859 6.98518 24.2859Z"
                          fill="black"
                        />
                        <path
                          d="M25.9675 12.1689C25.9675 9.18281 23.5418 6.75344 20.5603 6.75344C20.1648 6.75344 19.7767 6.79583 19.3983 6.87904L19.8112 6.40949C20.3037 5.84961 20.5748 5.13029 20.5748 4.38416V3.61634C20.5748 3.13577 20.1842 2.74477 19.7042 2.74477H19.4582V2.18317C19.4582 1.45384 18.8649 0.860519 18.1356 0.860519H13.9868C13.2574 0.860519 12.6641 1.45384 12.6641 2.18317V2.74482H12.5689C12.0888 2.74482 11.6982 3.13582 11.6982 3.61639V4.38421C11.6982 5.13029 11.9693 5.84956 12.4618 6.40954L13.3637 7.43492C13.5202 7.61292 13.6063 7.8415 13.6063 8.08216C13.6063 8.29213 13.7765 8.46051 13.9865 8.46051C14.1964 8.46051 14.3666 8.28864 14.3666 8.07867C14.3666 7.65657 14.2132 7.24965 13.9345 6.9328L13.0327 5.90742C12.6623 5.48628 12.4584 4.94531 12.4584 4.38411V3.61629C12.4584 3.55488 12.508 3.50491 12.5689 3.50491H19.7043C19.7652 3.50491 19.8147 3.55483 19.8147 3.61629V4.38411C19.8147 4.94536 19.6108 5.48633 19.2405 5.90742L18.3386 6.9328C18.06 7.24954 17.9066 7.65652 17.9066 8.08211C17.9066 9.44447 18.2906 10.7747 18.9941 11.9279H13.281C13.6942 11.2516 13.9984 10.5124 14.1788 9.73005C14.226 9.5255 14.0984 9.32146 13.8939 9.27421C13.6893 9.22702 13.4853 9.35464 13.438 9.55919C13.1313 10.8891 12.4293 12.0828 11.408 13.0115C9.89798 14.3845 8.10457 16.6845 8.03957 19.8895C7.81964 19.784 7.58358 19.7131 7.34221 19.6784C7.32455 19.0849 7.39031 17.7271 8.22687 16.5699L8.39096 16.3576C8.51792 16.1934 8.48954 15.9576 8.32723 15.828C8.16491 15.6985 7.92875 15.7232 7.79678 15.8836C7.7334 15.9606 7.67336 16.0383 7.61631 16.1168L6.21343 17.9321C6.13584 17.2335 5.90438 16.3561 5.27662 15.7273C4.09271 14.5414 2.02591 14.7664 1.9384 14.7765C1.76319 14.7969 1.625 14.9352 1.60472 15.1104C1.59455 15.1979 1.37007 17.2675 2.55362 18.453C3.27901 19.1796 4.33545 19.3764 5.06539 19.4176L4.53707 20.1012C3.37269 19.5699 2.0773 19.9982 1.13411 21.2355C1.00685 21.4024 1.03902 21.6409 1.20599 21.7682C1.37296 21.8955 1.6115 21.8633 1.73871 21.6963C2.47082 20.7358 3.44735 20.4015 4.2875 20.8239C5.33767 21.352 5.5405 22.71 4.7922 24.203C4.35093 25.0835 3.74491 25.6888 3.08569 25.9074C2.64523 26.0534 2.19606 26.0218 1.78661 25.816C0.854952 25.3475 0.578222 24.2434 1.06431 22.9347C1.1374 22.7379 1.03715 22.5191 0.840385 22.446C0.643623 22.3729 0.424809 22.4731 0.351719 22.67C-0.271038 24.3465 0.158093 25.848 1.44508 26.4951C2.03041 26.7895 2.7035 26.8351 3.32489 26.629C3.89206 26.4409 4.40616 26.0647 4.84556 25.5247C5.33575 26.3074 6.10135 26.7581 6.98541 26.7581C7.7551 26.7581 8.44989 26.4139 8.94169 25.7889C9.20754 25.451 9.40633 25.0411 9.53526 24.5748C9.84284 25.0387 10.1966 25.501 10.5939 25.9572C11.0372 26.4663 11.68 26.7582 12.3571 26.7582H19.9159C20.5931 26.7582 21.2358 26.4663 21.6792 25.9572C22.9104 24.5434 23.7069 23.0998 24.0465 21.6664C24.0949 21.4621 23.9685 21.2573 23.7642 21.2089C23.5599 21.1607 23.3552 21.2869 23.3068 21.4912C22.9959 22.8034 22.2554 24.138 21.1059 25.458C20.8069 25.8011 20.3732 25.998 19.9159 25.998H12.3571C11.8998 25.998 11.466 25.8011 11.1671 25.458C10.5711 24.7736 10.0804 24.0777 9.70663 23.3879C9.71234 23.1981 9.70951 23.008 9.69712 22.8184C9.63941 21.9341 9.38119 21.1803 8.94159 20.6216C8.89991 20.5686 8.85585 20.5176 8.81043 20.4678C8.80127 20.3329 8.79662 20.1991 8.79662 20.0686C8.79662 17.0476 10.4948 14.8694 11.9194 13.574C12.2219 13.299 12.4984 13.0025 12.7489 12.6882H19.5253C19.7753 13.003 20.0518 13.2997 20.3535 13.574C21.7781 14.8694 23.4763 17.0476 23.4763 20.0686C23.4763 20.2786 23.6465 20.4487 23.8564 20.4487C24.0664 20.4487 24.2366 20.2786 24.2366 20.0686C24.2366 18.8009 23.9652 17.6724 23.5444 16.6834C25.0471 15.6849 25.9675 13.9855 25.9675 12.1689ZM13.4243 2.18317C13.4243 1.87306 13.6766 1.62076 13.9867 1.62076H18.1355C18.4457 1.62076 18.698 1.87306 18.698 2.18317V2.74482H13.4243V2.18317ZM6.64054 18.6225C6.5804 19.0545 6.57332 19.426 6.58086 19.6866C6.13508 19.7607 5.72355 19.9562 5.37702 20.2573L6.64054 18.6225ZM3.09151 17.916C2.40583 17.2292 2.33415 16.0708 2.34331 15.5145C2.89758 15.5041 4.05027 15.5751 4.73848 16.2644C5.42416 16.9513 5.49584 18.1097 5.48668 18.6659C4.93282 18.6768 3.77982 18.6053 3.09151 17.916ZM8.94933 23.2052C8.94933 24.8757 8.16006 25.998 6.9853 25.998C6.26199 25.998 5.66518 25.5692 5.32624 24.8147C5.37601 24.7267 5.42487 24.6371 5.47166 24.5437C5.94272 23.6038 6.10559 22.686 5.94262 21.8897C5.88238 21.5953 5.77823 21.3238 5.63499 21.0812C5.98101 20.648 6.45289 20.4124 6.98525 20.4124C8.16005 20.4125 8.94933 21.5348 8.94933 23.2052ZM20.865 13.0116C19.9703 12.1981 19.3205 11.1685 18.9685 10.0433C19.4259 9.69854 19.9828 9.51078 20.5603 9.51078C22.0233 9.51078 23.2135 10.7032 23.2135 12.1689C23.2135 13.0291 22.7971 13.8292 22.1093 14.3252C21.7001 13.8204 21.2722 13.382 20.865 13.0116ZM23.2137 15.9885C23.0155 15.613 22.7974 15.2609 22.5672 14.9321C23.4437 14.2935 23.9737 13.2694 23.9737 12.1689C23.9737 10.284 22.4425 8.75054 20.5604 8.75054C19.9244 8.75054 19.3077 8.92743 18.774 9.25646C18.7034 8.86992 18.6667 8.47594 18.6667 8.07872C18.6667 8.02217 18.6719 7.96623 18.6815 7.91125C19.2743 7.64757 19.9054 7.51368 20.5604 7.51368C23.1227 7.51368 25.2074 9.60203 25.2074 12.1689C25.2073 13.694 24.4524 15.1228 23.2137 15.9885Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>{data.strIngredient1}</h4>
                      <h5>{data.strMeasure1}</h5>
                    </div>
                  </div>
                  <div className={classes.layout}>
                    <div className={classes.svg}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="27"
                        viewBox="0 0 26 27"
                        fill="none"
                      >
                        <path
                          d="M2.54962 25.5175C2.76191 25.5175 2.97592 25.4268 3.0748 25.2294C3.23535 24.909 3.02088 24.521 2.55331 24.2859C2.22605 24.1213 1.6865 24.0289 1.48503 24.4311C1.32449 24.7515 1.53895 25.1395 2.00653 25.3746C2.19368 25.4688 2.38214 25.5175 2.54962 25.5175Z"
                          fill="black"
                        />
                        <path
                          d="M6.98518 24.2859C6.46156 24.2859 6.09586 24.5364 6.09586 24.8951C6.09586 25.2538 6.46156 25.5043 6.98518 25.5043C7.5088 25.5043 7.8745 25.2538 7.8745 24.8951C7.87455 24.5364 7.50885 24.2859 6.98518 24.2859Z"
                          fill="black"
                        />
                        <path
                          d="M25.9675 12.1689C25.9675 9.18281 23.5418 6.75344 20.5603 6.75344C20.1648 6.75344 19.7767 6.79583 19.3983 6.87904L19.8112 6.40949C20.3037 5.84961 20.5748 5.13029 20.5748 4.38416V3.61634C20.5748 3.13577 20.1842 2.74477 19.7042 2.74477H19.4582V2.18317C19.4582 1.45384 18.8649 0.860519 18.1356 0.860519H13.9868C13.2574 0.860519 12.6641 1.45384 12.6641 2.18317V2.74482H12.5689C12.0888 2.74482 11.6982 3.13582 11.6982 3.61639V4.38421C11.6982 5.13029 11.9693 5.84956 12.4618 6.40954L13.3637 7.43492C13.5202 7.61292 13.6063 7.8415 13.6063 8.08216C13.6063 8.29213 13.7765 8.46051 13.9865 8.46051C14.1964 8.46051 14.3666 8.28864 14.3666 8.07867C14.3666 7.65657 14.2132 7.24965 13.9345 6.9328L13.0327 5.90742C12.6623 5.48628 12.4584 4.94531 12.4584 4.38411V3.61629C12.4584 3.55488 12.508 3.50491 12.5689 3.50491H19.7043C19.7652 3.50491 19.8147 3.55483 19.8147 3.61629V4.38411C19.8147 4.94536 19.6108 5.48633 19.2405 5.90742L18.3386 6.9328C18.06 7.24954 17.9066 7.65652 17.9066 8.08211C17.9066 9.44447 18.2906 10.7747 18.9941 11.9279H13.281C13.6942 11.2516 13.9984 10.5124 14.1788 9.73005C14.226 9.5255 14.0984 9.32146 13.8939 9.27421C13.6893 9.22702 13.4853 9.35464 13.438 9.55919C13.1313 10.8891 12.4293 12.0828 11.408 13.0115C9.89798 14.3845 8.10457 16.6845 8.03957 19.8895C7.81964 19.784 7.58358 19.7131 7.34221 19.6784C7.32455 19.0849 7.39031 17.7271 8.22687 16.5699L8.39096 16.3576C8.51792 16.1934 8.48954 15.9576 8.32723 15.828C8.16491 15.6985 7.92875 15.7232 7.79678 15.8836C7.7334 15.9606 7.67336 16.0383 7.61631 16.1168L6.21343 17.9321C6.13584 17.2335 5.90438 16.3561 5.27662 15.7273C4.09271 14.5414 2.02591 14.7664 1.9384 14.7765C1.76319 14.7969 1.625 14.9352 1.60472 15.1104C1.59455 15.1979 1.37007 17.2675 2.55362 18.453C3.27901 19.1796 4.33545 19.3764 5.06539 19.4176L4.53707 20.1012C3.37269 19.5699 2.0773 19.9982 1.13411 21.2355C1.00685 21.4024 1.03902 21.6409 1.20599 21.7682C1.37296 21.8955 1.6115 21.8633 1.73871 21.6963C2.47082 20.7358 3.44735 20.4015 4.2875 20.8239C5.33767 21.352 5.5405 22.71 4.7922 24.203C4.35093 25.0835 3.74491 25.6888 3.08569 25.9074C2.64523 26.0534 2.19606 26.0218 1.78661 25.816C0.854952 25.3475 0.578222 24.2434 1.06431 22.9347C1.1374 22.7379 1.03715 22.5191 0.840385 22.446C0.643623 22.3729 0.424809 22.4731 0.351719 22.67C-0.271038 24.3465 0.158093 25.848 1.44508 26.4951C2.03041 26.7895 2.7035 26.8351 3.32489 26.629C3.89206 26.4409 4.40616 26.0647 4.84556 25.5247C5.33575 26.3074 6.10135 26.7581 6.98541 26.7581C7.7551 26.7581 8.44989 26.4139 8.94169 25.7889C9.20754 25.451 9.40633 25.0411 9.53526 24.5748C9.84284 25.0387 10.1966 25.501 10.5939 25.9572C11.0372 26.4663 11.68 26.7582 12.3571 26.7582H19.9159C20.5931 26.7582 21.2358 26.4663 21.6792 25.9572C22.9104 24.5434 23.7069 23.0998 24.0465 21.6664C24.0949 21.4621 23.9685 21.2573 23.7642 21.2089C23.5599 21.1607 23.3552 21.2869 23.3068 21.4912C22.9959 22.8034 22.2554 24.138 21.1059 25.458C20.8069 25.8011 20.3732 25.998 19.9159 25.998H12.3571C11.8998 25.998 11.466 25.8011 11.1671 25.458C10.5711 24.7736 10.0804 24.0777 9.70663 23.3879C9.71234 23.1981 9.70951 23.008 9.69712 22.8184C9.63941 21.9341 9.38119 21.1803 8.94159 20.6216C8.89991 20.5686 8.85585 20.5176 8.81043 20.4678C8.80127 20.3329 8.79662 20.1991 8.79662 20.0686C8.79662 17.0476 10.4948 14.8694 11.9194 13.574C12.2219 13.299 12.4984 13.0025 12.7489 12.6882H19.5253C19.7753 13.003 20.0518 13.2997 20.3535 13.574C21.7781 14.8694 23.4763 17.0476 23.4763 20.0686C23.4763 20.2786 23.6465 20.4487 23.8564 20.4487C24.0664 20.4487 24.2366 20.2786 24.2366 20.0686C24.2366 18.8009 23.9652 17.6724 23.5444 16.6834C25.0471 15.6849 25.9675 13.9855 25.9675 12.1689ZM13.4243 2.18317C13.4243 1.87306 13.6766 1.62076 13.9867 1.62076H18.1355C18.4457 1.62076 18.698 1.87306 18.698 2.18317V2.74482H13.4243V2.18317ZM6.64054 18.6225C6.5804 19.0545 6.57332 19.426 6.58086 19.6866C6.13508 19.7607 5.72355 19.9562 5.37702 20.2573L6.64054 18.6225ZM3.09151 17.916C2.40583 17.2292 2.33415 16.0708 2.34331 15.5145C2.89758 15.5041 4.05027 15.5751 4.73848 16.2644C5.42416 16.9513 5.49584 18.1097 5.48668 18.6659C4.93282 18.6768 3.77982 18.6053 3.09151 17.916ZM8.94933 23.2052C8.94933 24.8757 8.16006 25.998 6.9853 25.998C6.26199 25.998 5.66518 25.5692 5.32624 24.8147C5.37601 24.7267 5.42487 24.6371 5.47166 24.5437C5.94272 23.6038 6.10559 22.686 5.94262 21.8897C5.88238 21.5953 5.77823 21.3238 5.63499 21.0812C5.98101 20.648 6.45289 20.4124 6.98525 20.4124C8.16005 20.4125 8.94933 21.5348 8.94933 23.2052ZM20.865 13.0116C19.9703 12.1981 19.3205 11.1685 18.9685 10.0433C19.4259 9.69854 19.9828 9.51078 20.5603 9.51078C22.0233 9.51078 23.2135 10.7032 23.2135 12.1689C23.2135 13.0291 22.7971 13.8292 22.1093 14.3252C21.7001 13.8204 21.2722 13.382 20.865 13.0116ZM23.2137 15.9885C23.0155 15.613 22.7974 15.2609 22.5672 14.9321C23.4437 14.2935 23.9737 13.2694 23.9737 12.1689C23.9737 10.284 22.4425 8.75054 20.5604 8.75054C19.9244 8.75054 19.3077 8.92743 18.774 9.25646C18.7034 8.86992 18.6667 8.47594 18.6667 8.07872C18.6667 8.02217 18.6719 7.96623 18.6815 7.91125C19.2743 7.64757 19.9054 7.51368 20.5604 7.51368C23.1227 7.51368 25.2074 9.60203 25.2074 12.1689C25.2073 13.694 24.4524 15.1228 23.2137 15.9885Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>{data.strIngredient2}</h4>
                      <h5>{data.strMeasure2}</h5>
                    </div>
                  </div>
                  <div className={classes.layout}>
                    <div className={classes.svg}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="27"
                        viewBox="0 0 26 27"
                        fill="none"
                      >
                        <path
                          d="M2.54962 25.5175C2.76191 25.5175 2.97592 25.4268 3.0748 25.2294C3.23535 24.909 3.02088 24.521 2.55331 24.2859C2.22605 24.1213 1.6865 24.0289 1.48503 24.4311C1.32449 24.7515 1.53895 25.1395 2.00653 25.3746C2.19368 25.4688 2.38214 25.5175 2.54962 25.5175Z"
                          fill="black"
                        />
                        <path
                          d="M6.98518 24.2859C6.46156 24.2859 6.09586 24.5364 6.09586 24.8951C6.09586 25.2538 6.46156 25.5043 6.98518 25.5043C7.5088 25.5043 7.8745 25.2538 7.8745 24.8951C7.87455 24.5364 7.50885 24.2859 6.98518 24.2859Z"
                          fill="black"
                        />
                        <path
                          d="M25.9675 12.1689C25.9675 9.18281 23.5418 6.75344 20.5603 6.75344C20.1648 6.75344 19.7767 6.79583 19.3983 6.87904L19.8112 6.40949C20.3037 5.84961 20.5748 5.13029 20.5748 4.38416V3.61634C20.5748 3.13577 20.1842 2.74477 19.7042 2.74477H19.4582V2.18317C19.4582 1.45384 18.8649 0.860519 18.1356 0.860519H13.9868C13.2574 0.860519 12.6641 1.45384 12.6641 2.18317V2.74482H12.5689C12.0888 2.74482 11.6982 3.13582 11.6982 3.61639V4.38421C11.6982 5.13029 11.9693 5.84956 12.4618 6.40954L13.3637 7.43492C13.5202 7.61292 13.6063 7.8415 13.6063 8.08216C13.6063 8.29213 13.7765 8.46051 13.9865 8.46051C14.1964 8.46051 14.3666 8.28864 14.3666 8.07867C14.3666 7.65657 14.2132 7.24965 13.9345 6.9328L13.0327 5.90742C12.6623 5.48628 12.4584 4.94531 12.4584 4.38411V3.61629C12.4584 3.55488 12.508 3.50491 12.5689 3.50491H19.7043C19.7652 3.50491 19.8147 3.55483 19.8147 3.61629V4.38411C19.8147 4.94536 19.6108 5.48633 19.2405 5.90742L18.3386 6.9328C18.06 7.24954 17.9066 7.65652 17.9066 8.08211C17.9066 9.44447 18.2906 10.7747 18.9941 11.9279H13.281C13.6942 11.2516 13.9984 10.5124 14.1788 9.73005C14.226 9.5255 14.0984 9.32146 13.8939 9.27421C13.6893 9.22702 13.4853 9.35464 13.438 9.55919C13.1313 10.8891 12.4293 12.0828 11.408 13.0115C9.89798 14.3845 8.10457 16.6845 8.03957 19.8895C7.81964 19.784 7.58358 19.7131 7.34221 19.6784C7.32455 19.0849 7.39031 17.7271 8.22687 16.5699L8.39096 16.3576C8.51792 16.1934 8.48954 15.9576 8.32723 15.828C8.16491 15.6985 7.92875 15.7232 7.79678 15.8836C7.7334 15.9606 7.67336 16.0383 7.61631 16.1168L6.21343 17.9321C6.13584 17.2335 5.90438 16.3561 5.27662 15.7273C4.09271 14.5414 2.02591 14.7664 1.9384 14.7765C1.76319 14.7969 1.625 14.9352 1.60472 15.1104C1.59455 15.1979 1.37007 17.2675 2.55362 18.453C3.27901 19.1796 4.33545 19.3764 5.06539 19.4176L4.53707 20.1012C3.37269 19.5699 2.0773 19.9982 1.13411 21.2355C1.00685 21.4024 1.03902 21.6409 1.20599 21.7682C1.37296 21.8955 1.6115 21.8633 1.73871 21.6963C2.47082 20.7358 3.44735 20.4015 4.2875 20.8239C5.33767 21.352 5.5405 22.71 4.7922 24.203C4.35093 25.0835 3.74491 25.6888 3.08569 25.9074C2.64523 26.0534 2.19606 26.0218 1.78661 25.816C0.854952 25.3475 0.578222 24.2434 1.06431 22.9347C1.1374 22.7379 1.03715 22.5191 0.840385 22.446C0.643623 22.3729 0.424809 22.4731 0.351719 22.67C-0.271038 24.3465 0.158093 25.848 1.44508 26.4951C2.03041 26.7895 2.7035 26.8351 3.32489 26.629C3.89206 26.4409 4.40616 26.0647 4.84556 25.5247C5.33575 26.3074 6.10135 26.7581 6.98541 26.7581C7.7551 26.7581 8.44989 26.4139 8.94169 25.7889C9.20754 25.451 9.40633 25.0411 9.53526 24.5748C9.84284 25.0387 10.1966 25.501 10.5939 25.9572C11.0372 26.4663 11.68 26.7582 12.3571 26.7582H19.9159C20.5931 26.7582 21.2358 26.4663 21.6792 25.9572C22.9104 24.5434 23.7069 23.0998 24.0465 21.6664C24.0949 21.4621 23.9685 21.2573 23.7642 21.2089C23.5599 21.1607 23.3552 21.2869 23.3068 21.4912C22.9959 22.8034 22.2554 24.138 21.1059 25.458C20.8069 25.8011 20.3732 25.998 19.9159 25.998H12.3571C11.8998 25.998 11.466 25.8011 11.1671 25.458C10.5711 24.7736 10.0804 24.0777 9.70663 23.3879C9.71234 23.1981 9.70951 23.008 9.69712 22.8184C9.63941 21.9341 9.38119 21.1803 8.94159 20.6216C8.89991 20.5686 8.85585 20.5176 8.81043 20.4678C8.80127 20.3329 8.79662 20.1991 8.79662 20.0686C8.79662 17.0476 10.4948 14.8694 11.9194 13.574C12.2219 13.299 12.4984 13.0025 12.7489 12.6882H19.5253C19.7753 13.003 20.0518 13.2997 20.3535 13.574C21.7781 14.8694 23.4763 17.0476 23.4763 20.0686C23.4763 20.2786 23.6465 20.4487 23.8564 20.4487C24.0664 20.4487 24.2366 20.2786 24.2366 20.0686C24.2366 18.8009 23.9652 17.6724 23.5444 16.6834C25.0471 15.6849 25.9675 13.9855 25.9675 12.1689ZM13.4243 2.18317C13.4243 1.87306 13.6766 1.62076 13.9867 1.62076H18.1355C18.4457 1.62076 18.698 1.87306 18.698 2.18317V2.74482H13.4243V2.18317ZM6.64054 18.6225C6.5804 19.0545 6.57332 19.426 6.58086 19.6866C6.13508 19.7607 5.72355 19.9562 5.37702 20.2573L6.64054 18.6225ZM3.09151 17.916C2.40583 17.2292 2.33415 16.0708 2.34331 15.5145C2.89758 15.5041 4.05027 15.5751 4.73848 16.2644C5.42416 16.9513 5.49584 18.1097 5.48668 18.6659C4.93282 18.6768 3.77982 18.6053 3.09151 17.916ZM8.94933 23.2052C8.94933 24.8757 8.16006 25.998 6.9853 25.998C6.26199 25.998 5.66518 25.5692 5.32624 24.8147C5.37601 24.7267 5.42487 24.6371 5.47166 24.5437C5.94272 23.6038 6.10559 22.686 5.94262 21.8897C5.88238 21.5953 5.77823 21.3238 5.63499 21.0812C5.98101 20.648 6.45289 20.4124 6.98525 20.4124C8.16005 20.4125 8.94933 21.5348 8.94933 23.2052ZM20.865 13.0116C19.9703 12.1981 19.3205 11.1685 18.9685 10.0433C19.4259 9.69854 19.9828 9.51078 20.5603 9.51078C22.0233 9.51078 23.2135 10.7032 23.2135 12.1689C23.2135 13.0291 22.7971 13.8292 22.1093 14.3252C21.7001 13.8204 21.2722 13.382 20.865 13.0116ZM23.2137 15.9885C23.0155 15.613 22.7974 15.2609 22.5672 14.9321C23.4437 14.2935 23.9737 13.2694 23.9737 12.1689C23.9737 10.284 22.4425 8.75054 20.5604 8.75054C19.9244 8.75054 19.3077 8.92743 18.774 9.25646C18.7034 8.86992 18.6667 8.47594 18.6667 8.07872C18.6667 8.02217 18.6719 7.96623 18.6815 7.91125C19.2743 7.64757 19.9054 7.51368 20.5604 7.51368C23.1227 7.51368 25.2074 9.60203 25.2074 12.1689C25.2073 13.694 24.4524 15.1228 23.2137 15.9885Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>{data.strIngredient3}</h4>
                      <h5>{data.strMeasure3}</h5>
                    </div>
                  </div>
                  <div className={classes.layout}>
                    <div className={classes.svg}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="27"
                        viewBox="0 0 26 27"
                        fill="none"
                      >
                        <path
                          d="M2.54962 25.5175C2.76191 25.5175 2.97592 25.4268 3.0748 25.2294C3.23535 24.909 3.02088 24.521 2.55331 24.2859C2.22605 24.1213 1.6865 24.0289 1.48503 24.4311C1.32449 24.7515 1.53895 25.1395 2.00653 25.3746C2.19368 25.4688 2.38214 25.5175 2.54962 25.5175Z"
                          fill="black"
                        />
                        <path
                          d="M6.98518 24.2859C6.46156 24.2859 6.09586 24.5364 6.09586 24.8951C6.09586 25.2538 6.46156 25.5043 6.98518 25.5043C7.5088 25.5043 7.8745 25.2538 7.8745 24.8951C7.87455 24.5364 7.50885 24.2859 6.98518 24.2859Z"
                          fill="black"
                        />
                        <path
                          d="M25.9675 12.1689C25.9675 9.18281 23.5418 6.75344 20.5603 6.75344C20.1648 6.75344 19.7767 6.79583 19.3983 6.87904L19.8112 6.40949C20.3037 5.84961 20.5748 5.13029 20.5748 4.38416V3.61634C20.5748 3.13577 20.1842 2.74477 19.7042 2.74477H19.4582V2.18317C19.4582 1.45384 18.8649 0.860519 18.1356 0.860519H13.9868C13.2574 0.860519 12.6641 1.45384 12.6641 2.18317V2.74482H12.5689C12.0888 2.74482 11.6982 3.13582 11.6982 3.61639V4.38421C11.6982 5.13029 11.9693 5.84956 12.4618 6.40954L13.3637 7.43492C13.5202 7.61292 13.6063 7.8415 13.6063 8.08216C13.6063 8.29213 13.7765 8.46051 13.9865 8.46051C14.1964 8.46051 14.3666 8.28864 14.3666 8.07867C14.3666 7.65657 14.2132 7.24965 13.9345 6.9328L13.0327 5.90742C12.6623 5.48628 12.4584 4.94531 12.4584 4.38411V3.61629C12.4584 3.55488 12.508 3.50491 12.5689 3.50491H19.7043C19.7652 3.50491 19.8147 3.55483 19.8147 3.61629V4.38411C19.8147 4.94536 19.6108 5.48633 19.2405 5.90742L18.3386 6.9328C18.06 7.24954 17.9066 7.65652 17.9066 8.08211C17.9066 9.44447 18.2906 10.7747 18.9941 11.9279H13.281C13.6942 11.2516 13.9984 10.5124 14.1788 9.73005C14.226 9.5255 14.0984 9.32146 13.8939 9.27421C13.6893 9.22702 13.4853 9.35464 13.438 9.55919C13.1313 10.8891 12.4293 12.0828 11.408 13.0115C9.89798 14.3845 8.10457 16.6845 8.03957 19.8895C7.81964 19.784 7.58358 19.7131 7.34221 19.6784C7.32455 19.0849 7.39031 17.7271 8.22687 16.5699L8.39096 16.3576C8.51792 16.1934 8.48954 15.9576 8.32723 15.828C8.16491 15.6985 7.92875 15.7232 7.79678 15.8836C7.7334 15.9606 7.67336 16.0383 7.61631 16.1168L6.21343 17.9321C6.13584 17.2335 5.90438 16.3561 5.27662 15.7273C4.09271 14.5414 2.02591 14.7664 1.9384 14.7765C1.76319 14.7969 1.625 14.9352 1.60472 15.1104C1.59455 15.1979 1.37007 17.2675 2.55362 18.453C3.27901 19.1796 4.33545 19.3764 5.06539 19.4176L4.53707 20.1012C3.37269 19.5699 2.0773 19.9982 1.13411 21.2355C1.00685 21.4024 1.03902 21.6409 1.20599 21.7682C1.37296 21.8955 1.6115 21.8633 1.73871 21.6963C2.47082 20.7358 3.44735 20.4015 4.2875 20.8239C5.33767 21.352 5.5405 22.71 4.7922 24.203C4.35093 25.0835 3.74491 25.6888 3.08569 25.9074C2.64523 26.0534 2.19606 26.0218 1.78661 25.816C0.854952 25.3475 0.578222 24.2434 1.06431 22.9347C1.1374 22.7379 1.03715 22.5191 0.840385 22.446C0.643623 22.3729 0.424809 22.4731 0.351719 22.67C-0.271038 24.3465 0.158093 25.848 1.44508 26.4951C2.03041 26.7895 2.7035 26.8351 3.32489 26.629C3.89206 26.4409 4.40616 26.0647 4.84556 25.5247C5.33575 26.3074 6.10135 26.7581 6.98541 26.7581C7.7551 26.7581 8.44989 26.4139 8.94169 25.7889C9.20754 25.451 9.40633 25.0411 9.53526 24.5748C9.84284 25.0387 10.1966 25.501 10.5939 25.9572C11.0372 26.4663 11.68 26.7582 12.3571 26.7582H19.9159C20.5931 26.7582 21.2358 26.4663 21.6792 25.9572C22.9104 24.5434 23.7069 23.0998 24.0465 21.6664C24.0949 21.4621 23.9685 21.2573 23.7642 21.2089C23.5599 21.1607 23.3552 21.2869 23.3068 21.4912C22.9959 22.8034 22.2554 24.138 21.1059 25.458C20.8069 25.8011 20.3732 25.998 19.9159 25.998H12.3571C11.8998 25.998 11.466 25.8011 11.1671 25.458C10.5711 24.7736 10.0804 24.0777 9.70663 23.3879C9.71234 23.1981 9.70951 23.008 9.69712 22.8184C9.63941 21.9341 9.38119 21.1803 8.94159 20.6216C8.89991 20.5686 8.85585 20.5176 8.81043 20.4678C8.80127 20.3329 8.79662 20.1991 8.79662 20.0686C8.79662 17.0476 10.4948 14.8694 11.9194 13.574C12.2219 13.299 12.4984 13.0025 12.7489 12.6882H19.5253C19.7753 13.003 20.0518 13.2997 20.3535 13.574C21.7781 14.8694 23.4763 17.0476 23.4763 20.0686C23.4763 20.2786 23.6465 20.4487 23.8564 20.4487C24.0664 20.4487 24.2366 20.2786 24.2366 20.0686C24.2366 18.8009 23.9652 17.6724 23.5444 16.6834C25.0471 15.6849 25.9675 13.9855 25.9675 12.1689ZM13.4243 2.18317C13.4243 1.87306 13.6766 1.62076 13.9867 1.62076H18.1355C18.4457 1.62076 18.698 1.87306 18.698 2.18317V2.74482H13.4243V2.18317ZM6.64054 18.6225C6.5804 19.0545 6.57332 19.426 6.58086 19.6866C6.13508 19.7607 5.72355 19.9562 5.37702 20.2573L6.64054 18.6225ZM3.09151 17.916C2.40583 17.2292 2.33415 16.0708 2.34331 15.5145C2.89758 15.5041 4.05027 15.5751 4.73848 16.2644C5.42416 16.9513 5.49584 18.1097 5.48668 18.6659C4.93282 18.6768 3.77982 18.6053 3.09151 17.916ZM8.94933 23.2052C8.94933 24.8757 8.16006 25.998 6.9853 25.998C6.26199 25.998 5.66518 25.5692 5.32624 24.8147C5.37601 24.7267 5.42487 24.6371 5.47166 24.5437C5.94272 23.6038 6.10559 22.686 5.94262 21.8897C5.88238 21.5953 5.77823 21.3238 5.63499 21.0812C5.98101 20.648 6.45289 20.4124 6.98525 20.4124C8.16005 20.4125 8.94933 21.5348 8.94933 23.2052ZM20.865 13.0116C19.9703 12.1981 19.3205 11.1685 18.9685 10.0433C19.4259 9.69854 19.9828 9.51078 20.5603 9.51078C22.0233 9.51078 23.2135 10.7032 23.2135 12.1689C23.2135 13.0291 22.7971 13.8292 22.1093 14.3252C21.7001 13.8204 21.2722 13.382 20.865 13.0116ZM23.2137 15.9885C23.0155 15.613 22.7974 15.2609 22.5672 14.9321C23.4437 14.2935 23.9737 13.2694 23.9737 12.1689C23.9737 10.284 22.4425 8.75054 20.5604 8.75054C19.9244 8.75054 19.3077 8.92743 18.774 9.25646C18.7034 8.86992 18.6667 8.47594 18.6667 8.07872C18.6667 8.02217 18.6719 7.96623 18.6815 7.91125C19.2743 7.64757 19.9054 7.51368 20.5604 7.51368C23.1227 7.51368 25.2074 9.60203 25.2074 12.1689C25.2073 13.694 24.4524 15.1228 23.2137 15.9885Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4>{data.strIngredient4}</h4>
                      <h5>{data.strMeasure4}</h5>
                    </div>
                  </div>
                </div>
                <div className={classes.action}>
                  <Link to={`/detail/${data.idMeal}`}>
                    <button>Detail</button>
                  </Link>

                  <button
                    onClick={() => {
                      postFavorite(data);
                      alert("Favorite Added");
                    }}
                  >
                    Add to Favorite
                  </button>
                </div>
              </div>
              <div className={classes.image}>
                <img src={data.strMealThumb} alt="" />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default FoodCard;

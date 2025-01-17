import { message } from "antd";
import axios from "axios";
import {
  getBannerImages,
  getBannerImagesError,
  getBannerImagesSuccess,
  getProfileVideosError,
  getProfileVideosSuccess,
  getUser,
  getUserError,
  getUserSuccess,
  setCurrentUser,
  setFullUser,
  setLikedUsersList,
  setStoriesList,
} from "../../actions/CommonActions";
import { base_url } from "../../constants";
import profileIcon from "../../assets/images/profileIcon.png";

const lang = JSON.parse(localStorage.getItem("lang"));

let url;
export const getUserDetails = async (dispatch) => {
  try {
    dispatch(getUser());
    const getUserData = await axios.get(`${base_url}user/total/users`, {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    });
    if (getUserData?.error) dispatch(getUserError(getUserData?.error));
    else {
      dispatch(getUserSuccess(getUserData));
    }
  } catch (e) {
    dispatch(getUserError(e));
  }
};

export async function getProfileVideosData(dispatch, usersCount) {
  const accessToken = JSON.parse(localStorage.getItem("data"));
  if (usersCount) {
    url = "user/8/0";
    try {
      const getProfileVideo = await axios.get(
        `${base_url}${url}/${accessToken ? accessToken.user_id : "1"}`,
        {
          headers: {
            "ngrok-skip-browser-warning": true,
          },
        }
      );
      if (getProfileVideo?.error) {
        dispatch(getProfileVideosError(getProfileVideo?.error));
      } else {
        dispatch(getProfileVideosSuccess(getProfileVideo));
      }
    } catch (e) {
      message.error(
        `${lang ? "No se puede reproducir el vídeo" : "cannot load the video"}`
      );
      dispatch(getProfileVideosError(e));
    }
  }
}

export async function getBannerImageData(dispatch) {
  const accessToken = JSON.parse(localStorage.getItem("data"));

  try {
    dispatch(getBannerImages());
    const getBannerImage = await axios.get(`${base_url}banners/6/0/banner`, {
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${accessToken?.accessToken}`,
      },
    });
    if (getBannerImage?.error)
      dispatch(getBannerImagesError(getBannerImage?.error));
    else {
      dispatch(getBannerImagesSuccess(getBannerImage));
    }
  } catch (e) {
    dispatch(getBannerImagesError(e));
  }
}

export const getStories = async (dispatch) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("data"));

  try {
    const getUserStories = await axios.get(
      `${base_url}story?userRole=${isAuthenticated?.user_type}`,

      {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    if (getUserStories?.error) {
    } else {
      storiesList(getUserStories?.data, dispatch, isAuthenticated);
    }
  } catch (e) {}
};

const storiesList = (data, dispatch, isAuthenticated) => {
  const getSingleStory = (item) => {
    return {
      id: item?.id,
      stories: [process.env.REACT_APP_S3_BUCKET_URL + item?.key],
      storyId: item?.id,
      storyType: item?.type?.split("story/")[1],
      storyThumbnail:
        item?.type?.split("story/")[1] === "video"
          ? item?.thumbnail
          : item?.key,
      contractorId: item?.contractorId,
      homeownerId: item?.homeownerId,
      tradesmanId: item?.tradesmanId,
      adminId: item?.adminId,
      duration:
        item?.type?.split("story/")[1] === "video"
          ? parseInt(item?.story_duration)
          : 4,
    };
  };

  let ids = [];
  let stories = [];

  for (let index1 = 0; index1 < data?.length; index1) {
    const item1 = data?.[index1];
    const type = item1?.adminId
      ? "admin"
      : item1?.tradesmanId
      ? "tradesman"
      : item1?.contractorId
      ? "contractor"
      : "homeowner";
    let result = [];

    data.slice(index1).forEach((item2) => {
      const tradesmanIdsMatch =
        item1?.tradesmanId !== null &&
        item2?.tradesmanId !== null &&
        item1?.tradesmanId === item2?.tradesmanId;
      const contractorIdsMatch =
        item1?.contractorId !== null &&
        item2?.contractorId !== null &&
        item1?.contractorId === item2?.contractorId;
      const homeownerIdsMatch =
        item1?.homeownerId !== null &&
        item2?.homeownerId !== null &&
        item1?.homeownerId === item2?.homeownerId;
      const adminsMatch =
        !!item1?.adminId &&
        !!item2?.adminId &&
        item1?.adminId === item2?.adminId;
      const typeExists = item2?.[type];

      const conditionSatisfied =
        ((tradesmanIdsMatch || contractorIdsMatch || homeownerIdsMatch) &&
          typeExists) ||
        adminsMatch;

      if (conditionSatisfied) {
        const story2 = getSingleStory(item2);
        result?.push(story2);

        ids?.push(item2?.id);
      }
    });
    ids?.push(index1);
    let userType = null;

    if (type) {
      if (type === "admin") {
        userType = {
          id: item1?.adminId,
          first_name: "GigMi",
          last_name: "",
          profile_picture: "profilePic/1689242203464_profile.jpeg",
          userId: item1?.adminId,
          type: "admin",
        };
      } else {
        userType = {
          id: item1?.[type]?.id,
          first_name: item1?.[type]?.first_name,
          last_name: item1?.[type]?.last_name,
          profile_picture: item1?.[type]?.profile_picture,
          userId: item1?.[type]?.userId,
          type,
        };
      }
    }

    const endResult = { stories: result };
    endResult["user"] = userType;

    stories = [...stories, endResult];

    data = data.filter((story) => !ids?.includes(story?.id));
  }

  const stories2 = [];
  stories?.map(({ stories: item, user }, index) => {
    if (user?.id === isAuthenticated?.id) {
      stories2.unshift({ stories: item, user });
    } else if (user?.type === "admin") {
      stories2.unshift({ stories: item, user });
    } else {
      stories2.push({ stories: item, user });
    }
  });

  let gigs = { id: isAuthenticated?.id, stories: stories2 };

  dispatch(setStoriesList(gigs));
};

export async function getProfileVideosData1(dispatch, userCount) {
  const accessToken = JSON.parse(localStorage.getItem("data"));
  const numbers = url.split("/").slice(1).map(Number);
  let [take, skip] = numbers;
  if (take + skip < userCount) {
    take = take + 8;
  }
  skip = skip;
  const newUrl = `user/${take}/${skip}`;
  url = newUrl;
  try {
    const getProfileVideo = await axios.get(
      `${base_url}${url}/${accessToken ? accessToken.user_id : "1"}`,
      {
        headers: {
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    if (getProfileVideo?.error) {
      dispatch(getProfileVideosError(getProfileVideo?.error));
    } else dispatch(getProfileVideosSuccess(getProfileVideo));
  } catch (e) {
    dispatch(getProfileVideosError(e));
  }
}

export const getFullUser = async (dispatch) => {
  const accessToken = JSON.parse(localStorage.getItem("data"));

  try {
    const getUserData = await axios.get(
      `${base_url}user/GetFullUser/${accessToken?.user_id}/${accessToken?.id}/${accessToken?.user_type}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    dispatch(setFullUser(getUserData));
  } catch (e) {
    message.error(e?.message);
  }
};

export const getCurrentUserDetails = async (dispatch) => {
  const accessToken = JSON.parse(localStorage.getItem("data"));
  if (accessToken.user_type === "contractor") {
    try {
      await axios
        .get(`${base_url}contractor/findByUserId/${accessToken?.user_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken?.accessToken}`,
            "ngrok-skip-browser-warning": true,
          },
        })
        .then((response) => {
          dispatch(setCurrentUser(response));
        })
        .catch((error) => {
          if (error?.response?.data?.message === "Session Expired") {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    } catch (error) {}
  }
  if (accessToken.user_type === "tradesman") {
    try {
      await axios
        .get(
          `${base_url}tradesman/findByUserId/${accessToken?.user_id}
          `,
          {
            headers: {
              Authorization: `Bearer ${accessToken?.accessToken}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        )
        .then((response) => {
          dispatch(setCurrentUser(response));
        })
        .catch((error) => {
          if (error?.response?.data?.message === "Session Expired") {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    } catch (error) {}
  }
  if (accessToken.user_type === "homeowner") {
    try {
      await axios
        .get(
          `${base_url}home-owner/findByUserId/${accessToken?.user_id}
          `,
          {
            headers: {
              Authorization: `Bearer ${accessToken?.accessToken}`,
              "ngrok-skip-browser-warning": true,
            },
          }
        )
        .then((response) => {
          dispatch(setCurrentUser(response));
        })
        .catch((error) => {
          if (error?.response?.data?.message === "Session Expired") {
            localStorage.clear();
            window.location.href = "/";
          }
        });
    } catch (error) {}
  }
};

export const userLikesList = async (dispatch) => {
  const accessToken = JSON.parse(localStorage.getItem("data"));

  try {
    await axios
      .get(
        `${base_url}saved-profiles/getTotalInteractions/${accessToken?.id}/${accessToken?.user_type}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken?.accessToken}`,
            "ngrok-skip-browser-warning": true,
          },
        }
      )
      .then((response) => {
        dispatch(setLikedUsersList(response));
      })
      .catch((error) => {
        message.error(error.message);
      });
  } catch (e) {
    dispatch(getUserError(e));
  }
};

export const handleDeleteStory = async (storyId) => {
  const accessToken = JSON.parse(localStorage.getItem("data"));

  try {
    await axios
      .delete(`${base_url}story/${storyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken?.accessToken}`,
          "ngrok-skip-browser-warning": true,
        },
      })
      .then((response) => {
        message.success(
          `${
            lang
              ? "Historia eliminada exitosamente"
              : "Story deleted successfully"
          }`
        );
      })
      .catch((error) => {
        message.error(`${lang ? "error de red" : "network error"}`);
      });
  } catch (e) {}
};

export const storiesDesireData = (stories) => {
  const stories2 = stories?.map((story) => {
    return {
      url: story?.stories[0],
      duration: story?.duration,
      type: story?.storyType,
      header: {
        heading: `${story?.first_name} ${story?.last_name}`,
        subheading:
          story?.type === "tradesman"
            ? "Gigster"
            : story?.type.charAt(0).toUpperCase() + story?.type.slice(1),
        profileImage:
          story?.profile_image === null || story?.profile_image === ""
            ? profileIcon
            : `${process.env.REACT_APP_S3_BUCKET_URL}${stories[currentIndex]?.profile_image}`,
      },
    };
  });
  const storyArray = stories2?.map((story) => [story]);

  return storyArray;
};

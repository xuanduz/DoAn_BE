export const getPageAmount = (length, pageSize) => {
  return length > pageSize ? Math.floor(length / pageSize) + (length % pageSize == 0 ? 0 : 1) : 1;
};

export const getListData = (listData, pageNum, pageSize) => {
  return listData.length ? listData.slice((pageNum - 1) * pageSize, pageNum * pageSize) : [];
};

export const getQueryWithId = (id) => {
  return id
    ? {
        where: {
          id: id,
        },
        required: true,
      }
    : {
        required: false,
      };
};

// Lấy lịch mai + 6 ngày nữa
export const getListDateNextWeek = () => {
  var d = new Date();
  const listDate = Array(7)
    .fill(0)
    .map((item, idx) => {
      d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("pt-br").split("/").join("-");
    });
  return listDate;
};

export const getCodePassword = (length) => {
  let newCode = "";
  for (let i = 1; i <= Array(length).length; i++) {
    newCode += Math.floor(Math.random() * 9 + 1);
  }
  return newCode;
};

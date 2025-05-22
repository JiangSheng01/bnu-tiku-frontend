import request from "./index";

export function login(data: { account: string; password: string }) {
  return request.post("/user/login", data);
}

export function getQuestionsByKp(
  selectedKp: string,
  pageNumber: string,
  currentPageSize: string
) {
  return request.get(
    `/question/search/kp/${encodeURIComponent(selectedKp)}/${encodeURIComponent(
      pageNumber
    )}/${encodeURIComponent(currentPageSize)}`
  );
}

export function getQuestionsByKeyword(
  keyword: string,
  currentPageNumber: string,
  currentPageSize: string
) {
  return request.get(
    `/question/search/keyword/${encodeURIComponent(
      keyword
    )}/${encodeURIComponent(currentPageNumber)}/${encodeURIComponent(
      currentPageSize
    )}`
  );
}

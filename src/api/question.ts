import request from "./index";

export interface QueryParams {
  knowledgePointName?: string;
  keyword?: string;
  difficulty: string;
  gradeId: number;
  simpleQuestionType: number;
  pageNumber: number;
  pageSize: number;
}

export interface CorrectParams {
  userId: number;
  correctType: string;
  correction: string | null;
  questionId: number;
  correctTags: {
    difficulty: string | null;
    grade: string | null;
    simpleQuestionType: number | null;
    source: string | null;
    knowledgePointName: string | null;
  } | null;
}

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

export function getQuestionByCombination(params: QueryParams) {
  return request.post(`/question/search/combination`, params);
}

export function getQuestionsByIds(ids: any) {
  return request.post(`/question/search/ids`, ids);
}

export function exportQuestionByIds(ids: any, format: string) {
  return request.post(`/question/export?format=${format}`, ids, {
    responseType: "blob",
  });
}

export function correctQuestionById(params: CorrectParams) {
  return request.post(`/question/correct`, params);
}

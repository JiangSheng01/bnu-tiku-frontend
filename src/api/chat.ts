import request from "@/api/index";

export interface StreamChatRequestParam {
  message: string;
  chatId: string;
  modelId: string;
}
export function getMessages(conversationId: string) {
  return request.get(
    `/chat/get/messages/${encodeURIComponent(conversationId)}`
  );
}
export function addConversation(userId: string, chatId: string) {
  return request.get(
    `/chat/add/conversation/${encodeURIComponent(chatId)}/${encodeURIComponent(
      userId
    )}`
  );
}
export function getConversations(userId: string) {
  return request.get(`/chat/get/conversation/${encodeURIComponent(userId)}`);
}

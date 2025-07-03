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

export function addConversation(
  userId: string,
  chatId: string,
  chatName: string
) {
  return request.post(
    `/chat/add/conversation/${encodeURIComponent(userId)}/${encodeURIComponent(
      chatId
    )}/${encodeURIComponent(chatName)}`
  );
}

export function getConversationIds(userId: string) {
  return request.get(
    `/chat/get/conversation/ids/${encodeURIComponent(userId)}`
  );
}

export function getConversationNames(userId: string) {
  return request.get(
    `/chat/get/conversation/names/${encodeURIComponent(userId)}`
  );
}

export function deleteConversation(userId: string, chatId: string) {
  return request.post(
    `/chat/delete/conversation/${encodeURIComponent(
      userId
    )}/${encodeURIComponent(chatId)}`
  );
}

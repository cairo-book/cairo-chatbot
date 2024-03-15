import { cairoBookUpdateUsecase } from "@repo/ai/features/cairoBookUpdate/cairoBookUpdate.usecase";
import "@repo/ai/features/cairoBookUpdate/embeddingsRepository";
import { testEmbeddings } from "@repo/ai/features/cairoBookUpdate/embeddingsRepository";
import { conversationalRetrievalQA } from "@repo/ai/features/cairoBookUpdate/ragChat";

console.log("Hello from Brain updater");
cairoBookUpdateUsecase();
// testEmbeddings();
conversationalRetrievalQA();

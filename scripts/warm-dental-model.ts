import { getDentalModel } from "@/lib/ai/dental-model";

async function main() {
  const model = await getDentalModel();
  console.log(
    JSON.stringify(
      {
        version: model.version,
        backbone: model.backbone,
        embeddingSize: model.embeddingSize,
        datasetKey: model.datasetKey,
        classes: model.stats.map((stat) => ({ label: stat.label, count: stat.count })),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
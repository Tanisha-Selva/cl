from pyspark.sql import SparkSession
from pyspark.sql.functions import explode, split, col

spark = SparkSession.builder \
    .appName("LabSparkDemo") \
    .master("local[*]") \
    .getOrCreate()

print("=== Spark Session Created Successfully ===")

data = ["cloud computing", "apache spark", "hadoop mapreduce", "apache spark cloud"]
df = spark.createDataFrame([(line,) for line in data], ["text"])

words_df = df.select(explode(split(col("text"), " ")).alias("word"))
word_counts = words_df.groupBy("word").count()

print("--- Spark Word Count Output ---")
word_counts.show()

spark.stop()

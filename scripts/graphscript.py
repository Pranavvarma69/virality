import networkx as nx
from pymongo import MongoClient
import itertools
from pyvis.network import Network

client = MongoClient("mongodb+srv://pranavrudraraju6_db_user:X7m0Bb9pIPFwU7Oq@cluster0.dm7hktz.mongodb.net/mydatabase?retryWrites=true&w=majority")
db = client["mydatabase"]
collection = db["socialposts"]

posts = list(collection.find({}, {"_id": 0, "influencer_name": 1, "metrics": 1}))
print(f"Loaded {len(posts)} posts")

influencer_posts = {}
for p in posts:
    metrics = p.get("metrics", {})
    if "likes" in metrics and "retweets" in metrics:
        influencer_posts.setdefault(p["influencer_name"], []).append(metrics)

G = nx.Graph()
for influencer in influencer_posts.keys():
    G.add_node(influencer)

avg_engagement = {}
for inf, metrics in influencer_posts.items():
    if len(metrics) > 0:
        avg_engagement[inf] = sum(m.get("likes", 0) + m.get("retweets", 0) for m in metrics) / len(metrics)

for (inf1, inf2) in itertools.combinations(avg_engagement.keys(), 2):
    diff = abs(avg_engagement[inf1] - avg_engagement[inf2])
    if diff < 1000:
        G.add_edge(inf1, inf2, weight=1 / (1 + diff))

print(f"Graph constructed with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")

metrics = {
    "num_nodes": G.number_of_nodes(),
    "num_edges": G.number_of_edges(),
    "avg_degree": sum(dict(G.degree()).values()) / G.number_of_nodes(),
    "degree_centrality": dict(nx.degree_centrality(G)),
    "betweenness_centrality": dict(nx.betweenness_centrality(G)),
}

db["graph_analysis"].delete_many({})
db["graph_analysis"].insert_one(metrics)
print("Graph metrics stored in MongoDB.")

net = Network(height="750px", width="100%", bgcolor="#ffffff", font_color="black")
net.from_nx(G)
net.force_atlas_2based()
net.show_buttons(filter_=['physics'])
net.show("influencer_network.html")
import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

const analyzer = new natural.SentimentAnalyzer(
  'English',
  natural.PorterStemmer,
  'afinn',
);
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's',
  't', 'can', 'will', 'just', 'don', 'should', 'now', 'also', 'would', 'could',
  'really', 'much', 'get', 'got', 'like', 'use', 'used', 'using', 'make', 'made',
]);

@Injectable()
export class SentimentService {
  analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    if (!text || text.trim().length === 0) return 'neutral';

    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    if (tokens.length === 0) return 'neutral';

    const score = analyzer.getSentiment(tokens);

    if (score > 0.05) return 'positive';
    if (score < -0.05) return 'negative';
    return 'neutral';
  }

  extractKeywords(
    comments: string[],
    topN = 30,
  ): Array<{ term: string; weight: number }> {
    if (comments.length === 0) return [];

    const tfidf = new TfIdf();
    const limitedComments = comments.slice(0, 1000);
    limitedComments.forEach((comment) => tfidf.addDocument(comment));

    const termScores = new Map<string, number>();

    for (let i = 0; i < limitedComments.length; i++) {
      const terms = tfidf.listTerms(i);
      for (const item of terms) {
        if (!STOPWORDS.has(item.term) && item.term.length > 2) {
          termScores.set(
            item.term,
            (termScores.get(item.term) || 0) + item.tfidf,
          );
        }
      }
    }

    return Array.from(termScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([term, weight]) => ({ term, weight }));
  }
}

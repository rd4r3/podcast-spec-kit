import { GetStaticProps } from 'next';
import { useState } from 'react';
import { FAQItem } from '@/types';
import { getAllFAQs } from '@/utils/data-loader';

interface FAQPageProps {
  faqs: FAQItem[];
  categories: string[];
}

export default function FAQPage({ faqs, categories }: FAQPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className="card">
            <button
              onClick={() => toggleExpanded(faq.id)}
              className="w-full text-left flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span className="text-2xl">{expandedId === faq.id ? '−' : '+'}</span>
            </button>

            {expandedId === faq.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<FAQPageProps> = async () => {
  const faqs = await getAllFAQs();
  const categories = [...new Set(faqs.map((faq) => faq.category))];

  return {
    props: {
      faqs,
      categories,
    },
  };
};

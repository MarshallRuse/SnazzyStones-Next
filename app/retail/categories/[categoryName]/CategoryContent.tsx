'use client';

import { motion } from 'motion/react';
import styles from '@/styles/modules/Retail.module.css';
import { ShopListingCondensed } from '@/types/EtsyAPITypes';
import FadingHeader from '@/components/FadingHeader';
import ProductList from '@/components/ProductList';
import { categoryPitches } from './categoryPitches';

interface CategoryContentProps {
  products: ShopListingCondensed[];
  category: string;
}

export function CategoryContent({ products, category }: CategoryContentProps) {
  return (
    <>
      <FadingHeader>
        <div
          className={`${styles.fallbackHeader} ${
            styles[`${category.toLowerCase().replace(' ', '_')}Header`]
          } heroSection`}
        />
        <div className='flex flex-col w-full'>
          <h1 className='heroTitle text-white overlayText'>{category}</h1>
          {categoryPitches[category as keyof typeof categoryPitches] && (
            <motion.div
              initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 1 }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.8 }}
              transition={{ duration: 0.4 }}
              className='bg-blueyonder-500 px-4 md:px-32 text-left md:text-center py-4 opacity-80 shadow-light'
            >
              <div className='max-w-2xl text-center text-white mx-auto'>
                {categoryPitches[category as keyof typeof categoryPitches]}
              </div>
            </motion.div>
          )}
        </div>
      </FadingHeader>
      <ProductList products={products} categories={category} />
    </>
  );
} 
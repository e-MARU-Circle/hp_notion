'use client';

import { motion, type Variants } from 'framer-motion';

const HeroSection = () => {
  const text = 'ABOJC';

  // 親コンテナ用のアニメーション定義 (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 0.2秒ずつずらして開始
        delayChildren: 0.5, // 0.5秒待ってから開始
      },
    },
  } as const satisfies Variants;

  // 各文字用のアニメーション定義 (ドロップイン)
  const letterVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  } as const satisfies Variants;

  return (
    <motion.section
      id="hero"
      className="relative flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/Photo/TOP.jpg)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="absolute inset-0 bg-white/30"></div>

      <motion.h1
        className="relative text-8xl font-black tracking-tighter text-black flex overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {text.split('').map((char, index) => (
          <motion.span key={index} variants={letterVariants}>
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.section>
  );
};

export default HeroSection;

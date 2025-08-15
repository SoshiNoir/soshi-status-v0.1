'use client';

type CardProps = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  onClick?: () => void;
};

export default function Card({
  id,
  title,
  description,
  image,
  link,
  onClick,
}: CardProps) {
  const content = (
    <div
      className='group relative w-full md:w-[160px] md:aspect-square overflow-hidden rounded-lg shadow-md transition-transform duration-300 cursor-pointer hover:scale-105'
      onClick={onClick}
    >
      <img
        src={image || '/default-card.png'}
        alt={title}
        className='w-full h-full object-cover'
        onError={(e) => {
          e.currentTarget.src = '/default-card.png';
        }}
      />
      <div className='absolute inset-0 flex flex-col justify-center items-center text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-4 text-center'>
        <h2 className='font-bold text-lg'>{title}</h2>
        {description && (
          <p className='text-sm mt-1 line-clamp-3'>{description}</p>
        )}
      </div>
    </div>
  );

  if (link)
    return (
      <a href={link} target='_blank' rel='noopener noreferrer'>
        {content}
      </a>
    );
  return content;
}

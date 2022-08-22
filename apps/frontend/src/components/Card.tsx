type CardProps = {
  imageUrl: string;
  type: 'basic' | 'gold';
};

const Card = ({
  imageUrl,
  type = 'basic'
}: CardProps) => {
  const filename = `${type}-${imageUrl}`;

  return (
    <div className="card-container">
      <img src={`/card-images/${filename}`} alt={filename} />
    </div>
  );
};

export default Card;

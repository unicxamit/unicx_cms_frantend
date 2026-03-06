

import { publicUrlFor } from "../../globals/constants";

function JobZImage({
  src,
  alt = "",
  fallback = "images/default-placeholder.png",
  ...rest
}) {
  const getImageSrc = () => {
    if (typeof src !== "string") {
      return publicUrlFor(fallback);
    }

    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    return publicUrlFor(src);
  };

  return (
    <img
      {...rest}
      src={getImageSrc()}
      alt={alt}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = publicUrlFor(fallback);
      }}
    />
  );
}

export default JobZImage;

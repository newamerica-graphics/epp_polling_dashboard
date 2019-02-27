const descriptionFormat = description => {
  const listItems = description.split("--").slice(1);
  return (
    <ul>
      {listItems.map(item => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

export default descriptionFormat;

package com.panacea.pilly_intro;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.View;
import java.lang.reflect.Array;
import java.util.ArrayList;
import androidx.core.content.res.ResourcesCompat;

public class TextCharacterRevealView extends View {

    private Paint paint;
    private float x;
    private float y;
    private String text = "Hello...";

    private float[] lengthTxt;
    private int[] alphas;

    private int alphaIncrementVal = 5;
    private int alphaStartNxtLetter = 90;
    private int[] lineBreakIndexes;

    boolean multipleLines = false;
    private float textSize;

    private float textSizeDp = 50;

    private Paint.FontMetrics fm;
    private int contentWidth;
    private int contentHeight;

    private boolean showText = false;

    public TextCharacterRevealView(Context context) {
        super(context);
        initialize();
    }

    public TextCharacterRevealView(Context context, AttributeSet attrs) {
        super(context, attrs);
        initialize();
    }

    public TextCharacterRevealView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initialize();
    }

    public void setTextSizeDp(float textSizeDp) {
        this.textSizeDp = textSizeDp;
        this.textSize = convertDpToPixel(textSizeDp);
        paint.setTextSize(this.textSize);
        setUpTextReveal();
    }

    public void setText(String text) {
        this.text = text;
        setUpTextReveal();
    }
    public float convertDpToPixel(float dp) {
        DisplayMetrics metrics = Resources.getSystem().getDisplayMetrics();
        float px = dp * (metrics.densityDpi / 160f);
        return Math.round(px);
    }

    public void setTextSize(float textSizeDp) {
        paint.setTextSize(convertDpToPixel(textSizeDp));
        setUpTextReveal();
    }

    private void initialize() {
        paint = new Paint();

        Typeface blackItalicRoboto = Typeface.createFromAsset
                (getResources().getAssets(), "fonts/Roboto-BlackItalic.ttf");

        int colorTxtPageTab = ResourcesCompat.getColor(getResources(), R.color.colorInstructionsTxtPageTab
                , null);
        paint.setStyle(Paint.Style.STROKE);
        float widthStroke = convertDpToPixel((float)2);

        paint.setStrokeWidth(widthStroke);
        paint.setFlags(Paint.ANTI_ALIAS_FLAG
        |Paint.LINEAR_TEXT_FLAG);

        paint.setTypeface(blackItalicRoboto);
        textSize = convertDpToPixel(textSizeDp);
        paint.setColor(colorTxtPageTab);
        paint.setTextSize(textSize);
        setUpTextReveal();
    }

    public void setFont(Typeface font){
        paint.setTypeface(font);
    }
    public void setTxtColor(int color){
        paint.setColor(color);
    }
    public void setTxtStyle(Paint.Style style){
        paint.setStyle(style);
    }

    public void setUpTextReveal() {
        int lastIndex = 0;
        int lineCount = 1;
        ArrayList<Integer> indexes = new ArrayList<>();
        for (int i = 0; i < text.length(); i++) {
            int index = text.indexOf('\n', lastIndex);
            if (index == (-1)) break;
            else {
                indexes.add(index);
                lineCount++;
                lastIndex = index + 1;
            }
        }
        if (indexes.size() > 0) {
            lineBreakIndexes = new int[indexes.size()];
            multipleLines = true;
            for (int i = 0; i < indexes.size(); i++) {
                Array.setInt(lineBreakIndexes, i, indexes.get(i));
            }
            contentWidth = 0;
            float width = 0;
            int startIndex = 0;
            float highestWidth = 0;

            for (int i = 0; i <= lineBreakIndexes.length; i++) {
                int indexBreak;
                if (i < lineBreakIndexes.length)
                    indexBreak = Array.getInt(lineBreakIndexes, i);
                else indexBreak = text.length();

                width = paint.measureText(text, startIndex, indexBreak);
                if (Float.compare(width, highestWidth) > 0) highestWidth = width;

                startIndex = indexBreak + 1;
            }
            contentWidth = Math.round(highestWidth);
        } else {
            multipleLines = false;
            contentWidth = Math.round(paint.measureText(text));
        }

        lengthTxt = new float[text.length()];
        alphas = new int[text.length()];

        int startIndex = 0;
        int nextLine = 0;
        int nextLineBreak = 0;
        if (multipleLines)
            nextLineBreak = Array.getInt(lineBreakIndexes, nextLine);

        for (int i = 0; i < lengthTxt.length; i++) {

            if (multipleLines && nextLineBreak == i) {
                startIndex = nextLineBreak + 1;
                nextLine++;

                if (lineBreakIndexes.length > nextLine)
                    nextLineBreak = Array.getInt(lineBreakIndexes, nextLine);
                Array.setFloat(lengthTxt, i, 0);
                Array.setInt(alphas, i, 0);
                continue;
            }
            float width = paint.measureText(text, startIndex, i);
            Array.setFloat(lengthTxt, i, width);
            Array.setInt(alphas, i, 0);
        }
        fm = paint.getFontMetrics();
        contentHeight = (Math.round(fm.descent - fm.ascent) * lineCount);

        y = (float) getPaddingTop() - fm.ascent;
        x = (float) getPaddingLeft();

        showText = false;
        requestLayout();
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        //super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        int height = 0;
        int width = 0;
        int desiredHeight = 0;
        int desiredWidth = 0;

        if (contentHeight > 0) desiredHeight = contentHeight +
                getPaddingTop() + getPaddingBottom();
        else desiredHeight = getSuggestedMinimumHeight() +
                getPaddingTop() + getPaddingBottom();

        if (contentWidth > 0)
            desiredWidth = contentWidth + getPaddingLeft() +
                    getPaddingRight();
        else desiredWidth = getSuggestedMinimumWidth() +
                getPaddingLeft() + getPaddingRight();

        height = resolveSizeAndState(desiredHeight, heightMeasureSpec, 0);
        width = resolveSizeAndState(desiredWidth, widthMeasureSpec, 1);

        setMeasuredDimension(width, height);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        float xOffset;
        int alpha;
        boolean lastInteration = false;
        int nextline = 0;
        float lineSize = fm.descent - fm.ascent;
        int nextBreakIndex = 0;
        if (multipleLines)
            nextBreakIndex = Array.getInt(lineBreakIndexes, nextline);
        float baseline = y;
        for (int i = 0; i < lengthTxt.length; i++) {
            xOffset = Array.getFloat(lengthTxt, i);
            alpha = Array.getInt(alphas, i);
            paint.setAlpha(alpha);

            if (multipleLines && nextBreakIndex == i) {
                nextline++;
                baseline = baseline + lineSize;
                if (lineBreakIndexes.length > nextline)
                    nextBreakIndex = Array.getInt(lineBreakIndexes, nextline);
                continue;
            }
            canvas.drawText(text, i, i + 1, x + xOffset, baseline
                    , paint);
            if (alpha == 255) continue;
            else if (alpha < alphaStartNxtLetter) lastInteration = true;

            alpha += alphaIncrementVal;
            alpha = Math.min(alpha, 255);
            Array.setInt(alphas, i, alpha);
            if (lastInteration) break;
        }

        setUpNxtFrame();
    }
    private void setUpNxtFrame() {
        int alpha = Array.getInt(alphas, alphas.length - 1);
        if (showText && alpha != 255) invalidate();
        else if (showText) {
            finishedReveal();
        }
    }

    public interface OnFinishRevealListener {
        void onFinishReveal();
    }

    private OnFinishRevealListener mListener;

    public void setFinishRevealListener(OnFinishRevealListener finishRevealListener) {
        mListener = finishRevealListener;
    }

    private void finishedReveal() {
        if (mListener != null) mListener.onFinishReveal();
    }

    public void restartReveal() {
        for (int i = 0; i < alphas.length; i++) {
            Array.setInt(alphas, i, 0);
        }
        showText = true;
        invalidate();
    }

    public void reset() {
        for (int i = 0; i < alphas.length; i++) {
            Array.setInt(alphas, i, 0);
        }
        showText = false;
        invalidate();
    }
}